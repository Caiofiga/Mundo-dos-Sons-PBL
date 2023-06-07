import React, { useState, useEffect } from "react";
import "../css/silaba.css";
import AnimatedPages from "./animated";
import { Navigate, useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";

const resposta2: string[] = [];
const Tempos: number[] = [];
let stopwatch = new Stopwatch();

enum GameState {
  STARTING,
  RUNNING,
  BETWEEN_LEVELS,
  COMPLETED,
}

interface StartScreenProps {
  onStart: () => void;
}

interface BetweenLevelsScreenProps {
  onNextLevel: () => void;
}

const BetweenLevelsScreen: React.FC<BetweenLevelsScreenProps> = ({
  onNextLevel,
}) => (
  <div>
    <h1>Level completed!</h1>
    <button onClick={onNextLevel}>Next Level</button>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div>
    <h1>Welcome to the Game!</h1>
    <button onClick={onStart}>Play</button>
  </div>
);

const Silaba = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  const syllables = ["Ma", "Bu", "La", "Ca", "Lho", "Te", "Vo", "Ca", "Ra"];

  const palavras = [
    ["macaco", "pato", "arvore", "buraco"],
    ["grama", "borboleta", "arvore", "buraco"],
    ["lago", "pato", "rato", "gato"],
    ["gato", "buraco", "cavalo", "vaca"],
    ["galinha", "cavalo", "ovelha", "milho"], //agora sao as que terminam com a silaba
    ["macaco", "martelo", "galinha", "fonte"],
    ["tucano", "fonte", "arvore", "vulcao"], //agora é a do meio
    ["vaca", "gato", "vulcao", "tucano"],
    ["rato", "aranha", "gato", "tucano"],
  ];

  const palavra_corretas = [
    ["macaco"],
    ["buraco"],
    ["lago"],
    ["cavalo"],
    ["milho"],
    ["fonte"],
    ["arvore"],
    ["tucano"],
    ["aranha"],
  ];
  const palavra_correta = palavra_corretas[currentSyllableIndex];
  const palavra = palavras[currentSyllableIndex];
  const pictures = palavra.map((word) => `src/img/${word}.png`);
  const sound = syllables.map((word) => `src/snd/${word}.mp3`);
  const navigate = useNavigate();

  const handleNextPhase = () => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(Tempos);
    if (currentSyllableIndex < palavras.length - 1) {
      setGameState(GameState.BETWEEN_LEVELS);
    } else {
      setGameState(GameState.COMPLETED);
      let answerObj = resposta2.slice(0);
      let tempoObj = Tempos.slice(0);

      addAnswersToDB("perguntas2", {
        userId: userId,
        answerObj: answerObj,
        tempoObj: tempoObj,
      });

    
    }
  };

  interface SyllableProps {
    syllable: string;
  }

  useEffect(() => {
    if (parabens) {
      setTimeout(() => {
        handleNextPhase();
      }, 3000); // delay for 3 seconds
    }
  }, [parabens]);

  const Syllable: React.FC<SyllableProps> = ({ syllable }) => (
    <div>
      <div className="syllable">
        <span>
          <img
            className="microfone"
            src="src/img/microfone.png"
            onClick={playSound}
          ></img>
        </span>
        <span>{syllable}</span>
      </div>
    </div>
  );

  interface PicturesProps {
    pictures: string[];
    onPictureClick: (word: string) => void;
  }

  const Pictures: React.FC<PicturesProps> = ({ pictures, onPictureClick }) => (
    <div className="pictures">
      {pictures.map((picture, index) => {
        const word = picture.split("/").pop()?.split(".")[0]; // Extract the word from the image URL
        return (
          <img
            key={index}
            src={picture}
            alt={word}
            onClick={() => onPictureClick(word || "")} // Pass the extracted word to onPictureClick
          />
        );
      })}
    </div>
  );
  const handlePictureClick = (word: string) => {
    console.log(word);
    resposta2.push(word);
    console.log(resposta2);
    handleNextPhase();
  };

  function playSound() {
    const audio = new Audio(sound[currentSyllableIndex]);
    audio.play();
    console.log("playing sound:" + sound[currentSyllableIndex]);
  }

  return (
    <AnimatedPages key={gameState}>
      {gameState === GameState.STARTING && (
        <StartScreen
          onStart={() => {
            setGameState(GameState.RUNNING);
            stopwatch.start();
          }}
        />
      )}
      {gameState === GameState.RUNNING && (
        <>
          <Syllable syllable={syllables[currentSyllableIndex]} />
          <div className="meio"></div>
          <Pictures pictures={pictures} onPictureClick={handlePictureClick} />
        </>
      )}
      {gameState === GameState.BETWEEN_LEVELS && (
        <BetweenLevelsScreen
          onNextLevel={() => {
            setGameState(GameState.RUNNING);
            setCurrentSyllableIndex(currentSyllableIndex + 1);
            stopwatch.start();
          }}
        />
      )}
      {gameState === GameState.COMPLETED && (
        <div>
          <span>Parabéns! Você completou o jogo!</span>
          <button onClick={() => navigate("/Imagem")}>Go to Image</button>
        </div>
      )}
    </AnimatedPages>
  );
};

export default Silaba;

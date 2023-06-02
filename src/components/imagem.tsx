import React, { useState, useEffect } from "react";
import "../css/imagem.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";

const resposta3: string[] = [];

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

const Imagem = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  // Now you can use userId in this component

  const words = ["caminho", "borboleta", "passaro", "abelha", "onca"];
  const image = "src/img/" + words[currentSyllableIndex] + ".png";

  const num_corretos = [
    [3, 2, 4, 5],
    [3, 4, 5, 6],
    [2, 4, 3, 5],
    [4, 2, 5, 3],
    [2, 1, 3, 4],
  ];
  const num_correto = [3, 4, 3, 3, 2];
  const word = words[currentSyllableIndex];
  const sound = words.map((word) => `src/snd/${word}.mp3`);
  const navigate = useNavigate();

  interface SyllableProps {
    image: string;
  }

  const Syllable: React.FC<SyllableProps> = ({ image }) => (
    <div>
      <div className="syllable">
        <span>
          <img
            className="microfone"
            src="src/img/microfone.png"
            onClick={playSound}
          ></img>
          <img className="syllableImage" src={image} alt={word}></img>
        </span>
      </div>
    </div>
  );

  interface WordsProps {
    words: number[];
    onWordClick: (word: number) => void;
  }

  const Words: React.FC<WordsProps> = ({ words, onWordClick }) => (
    <div className="words">
      {words.map((word, index) => (
        <div className="circle" key={index} onClick={() => onWordClick(word)}>
          {word}
        </div>
      ))}
    </div>
  );
  const handleWordClick = (word: string) => {
    console.log(word);
    resposta3.push(word);
    console.log(num_correto[currentSyllableIndex]);
    if (parseInt(word) === num_correto[currentSyllableIndex]) {
      console.log("acertou");
    } else {
      console.log("errou");
    }
    handleNextPhase();
  };

  const handleNextPhase = () => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(Tempos);
    if (currentSyllableIndex < words.length - 1) {
      setGameState(GameState.BETWEEN_LEVELS);
    } else {
      setGameState(GameState.COMPLETED);
      let answerObj = { userId: userId };
      resposta3.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });
      let tempoObj = { userId: userId };
      Tempos.slice(0).forEach((answer, index) => {
        tempoObj[`tempo${index + 1}`] = answer;
      });

      addAnswersToDB("perguntas3", { answerObj, tempoObj });
      alert("Parabéns! Você completou o jogo!");
      navigate("/Rimas");
    }
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
      {gameState === GameState.RUNNING && !parabens && (
        <div>
          <Syllable image={image} />
          <div className="meio"></div>
          <Words
            words={num_corretos[currentSyllableIndex]}
            onWordClick={handleWordClick}
          />
        </div>
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
          <button onClick={() => navigate("/Rimas")}>Go to Image</button>
        </div>
      )}
    </AnimatedPages>
  );
};

export default Imagem;

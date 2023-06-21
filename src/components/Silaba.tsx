import React, { useState } from "react";
import "../css/silaba.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import { GetConfetti, GetFireworks, GetStars } from "./congrats";
import ReactPlayer from "react-player";
import "bootstrap/dist/css/bootstrap.css";

const resposta2: string[] = [];
const Tempos: number[] = [];
const stopwatch = new Stopwatch();

function getSoundPaths(syllables: string[]): string[] {
  const counts: { [key: string]: number } = {};
  return syllables.map(syllable => {
    counts[syllable] = (counts[syllable] || 0) + 1;
    const suffix = counts[syllable] > 1 ? `-${counts[syllable]}` : '';
    return `/snd/${syllable.toLowerCase()}${suffix}q.mp3`;
  });
}


enum GameState {
  STARTING,
  RUNNING,
  BETWEEN_LEVELS,
  VIDEO,
  COMPLETED,
}

interface StartScreenProps {
  onStart: () => void;
}

interface BetweenLevelsScreenProps {
  onNextLevel: () => void;
}
interface GameOverProps {
  onNextgame: () => void;
}

interface VideoProps {
  onVideoEnd: () => void;
  }

  const VideoScreen: React.FC<VideoProps> = ({ onVideoEnd }) => (
    <div className="Videome" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 9999, 
        backgroundColor: 'black' 
      }}>
      <ReactPlayer 
        url="https://youtu.be/cuzRvtsSLig" 
        playing={true}
        onEnded={onVideoEnd}
        width='100%'
        height='100%'
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
  

const GameOverScreen: React.FC<GameOverProps> = ({ onNextgame }) => (
  <div className="app-container">
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <img  className="overandout" src="/img/color1.png" alt="gameOver"></img>
    <div className="Complete">
      <h1><b>Fase Completa!</b></h1>
      <button className="Button btn btn-primary" onClick={onNextgame}>
        Próximo Jogo
      </button>
    </div>
  </div>
);

const BetweenLevelsScreen: React.FC<BetweenLevelsScreenProps> = ({
  onNextLevel,
}) => (
  <div className="app-container">
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <div className="Congrats ">
      <h1>Parabéns!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextLevel}>
        Próxima Fase ⏩
      </button>
    </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div className="appContainer" style={{ backgroundImage: `url(/img/color0.png)` }}>
    <h1><b>Desafio 2: Junta a Sílaba com a Palavra</b></h1>
    <button className="btn btn-success" onClick={onStart}>
      Jogar
    </button>
  </div>
);

const Silaba = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  const syllables = ["Ma", "Bu", "La", "Ca", "Lho", "Te", "Vo", "Ca", "Ra"];

  const palavras = [
    ["macaco", "pato", "árvore", "buraco"],
    ["grama", "borboleta", "árvore", "buraco"],
    ["lago", "pato", "rato", "gato"],
    ["gato", "buraco", "cavalo", "vaca"],
    ["galinha", "cavalo", "ovelha", "milho"], //agora sao as que terminam com a silaba
    ["macaco", "martelo", "galinha", "ponte"],
    ["tucano", "ponte", "árvore", "vulcão"], //agora é a do meio
    ["vaca", "gato", "vulcão", "tucano"],
    ["rato", "aranha", "gato", "tucano"],
  ];

  const palavra = palavras[currentSyllableIndex];
  const pictures = palavra.map((word) => `/img/${word}.png`);
  const sound = getSoundPaths(syllables);
  const navigate = useNavigate();

  const handleNextPhase = () => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(Tempos);
    if (currentSyllableIndex < palavras.length - 1) {
      setGameState(GameState.BETWEEN_LEVELS);
    } else {
      setGameState(GameState.VIDEO);
      const answerObj = resposta2.slice(0);
      const tempoObj = Tempos.slice(0);

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

  const Syllable: React.FC<SyllableProps> = ({ syllable }) => (
    <div>
      <div className="syllable">
        <span>
          <img
            className="microfone"
            src="/img/mic.png"
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
      {gameState === GameState.VIDEO && (
        <VideoScreen onVideoEnd={() => setGameState(GameState.COMPLETED)} /> 
      )}
      {gameState === GameState.COMPLETED && (
        <GameOverScreen onNextgame={() => navigate("/Imagem")} />
      )}
    </AnimatedPages>
  );
};

export default Silaba;

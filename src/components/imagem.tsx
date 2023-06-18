import React, { useState } from "react";
import "../css/imagem.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import { GetConfetti, GetFireworks, GetStars } from "./congrats";
import "bootstrap/dist/css/bootstrap.css";

const resposta3: number[] = [];

const Tempos: number[] = [];
const stopwatch = new Stopwatch();

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

interface GameOverProps {
  onNextgame: () => void;
}

const GameOverScreen: React.FC<GameOverProps> = ({ onNextgame }) => (
  <div className="app-container">
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <div className="Complete">
      <h1>Fase Completa!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextgame}>
        Proximo Jogo
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
      <h1>Parabens!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextLevel}>
        Proxima Fase
      </button>
    </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div className="appContainer">
    <h1>Desafio 3: Conte as Silabas</h1>
    <button className="btn btn-outline-success" onClick={onStart}>
      Jogar
    </button>
  </div>
);

const Imagem = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  // Now you can use userId in this component

  const words = ["caminho", "borboleta", "passaro", "abelha", "onca"];
  const image = "/img/" + words[currentSyllableIndex] + ".png";

  const num_corretos = [
    [3, 2, 4, 5],
    [3, 4, 5, 6],
    [2, 4, 3, 5],
    [4, 2, 5, 3],
    [2, 1, 3, 4],
  ];
  const num_correto = [3, 4, 3, 3, 2];
  const word = words[currentSyllableIndex];
  const sound = words.map((word) => `/snd/${word}.mp3`);
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
            src="/img/mic.png"
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
  const handleWordClick = (word: number) => {
    console.log(word);
    resposta3.push(word);
    console.log(num_correto[currentSyllableIndex]);
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
      const answerObj = resposta3.slice(0);
      const tempoObj = Tempos.slice(0);

      addAnswersToDB("perguntas3", {
        userId: userId,
        answerObj: answerObj,
        tempoObj: tempoObj,
      });
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
      {gameState === GameState.RUNNING && (
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
          <GameOverScreen onNextgame={() => navigate("/Rimas")} />
        </div>
      )}
    </AnimatedPages>
  );
};

export default Imagem;

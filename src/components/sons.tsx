import React, { useState } from "react";
import "../css/sons.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import { GetConfetti, GetFireworks, GetStars } from "./congrats";
const respostas5: string[] = [];
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
      <h1>Fim de Jogo!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextgame}>
        Resultados
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
    <h1>Desafio 5: Identifique os sons</h1>
    <button className="btn btn-outline-success" onClick={onStart}>
      Jogar
    </button>
  </div>
);

const Sons = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const navigate = useNavigate();
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  const imagesMain = ["chinelo", "sol", "vaca", "manga", "pato"];
  const imageMainSrc = "/img/" + imagesMain[currentSyllableIndex] + ".png";

  const imagesSec = [
    ["chuva", "cobra"],
    ["zebra", "sapo"],
    ["fazenda", "vela"],
    ["milho", "ninho"],
    ["passaro", "banana"],
  ];

  const num_correto = ["sereia", "cavalo-marinho", "sol", "camarao", "raia"];
  const imageMain = imagesMain[currentSyllableIndex];

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
            onClick={() => playSound(image)}
          ></img>
          <img className="syllableImage" src={imageMainSrc} alt={image}></img>
        </span>
      </div>
    </div>
  );

  interface ImagesProps {
    images: string[];
    onImageClick: (image: string) => void;
  }
  const Images: React.FC<ImagesProps> = ({ images, onImageClick }) => (
    <div className="images">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <div>
            <img
              className="image"
              src={`/img/${image}.png`}
              alt={image}
              onClick={() => onImageClick(image)}
            ></img>
          </div>
          <div>
            <img
              className="microfone"
              src="/img/mic.png"
              onClick={() => playSound(image)}
            ></img>
          </div>
        </div>
      ))}
    </div>
  );
  const handleImageClick = (image: string) => {
    console.log(image);
    respostas5.push(image);
    console.log(num_correto[currentSyllableIndex]);
    if (image === num_correto[currentSyllableIndex]) {
      console.log("acertou");
    }
    handleNextPhase();
  };

  const handleNextPhase = () => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(Tempos);
    if (currentSyllableIndex < imagesMain.length - 1) {
      setGameState(GameState.BETWEEN_LEVELS);
    } else {
      setGameState(GameState.COMPLETED);
      const answerObj = respostas5.slice(0);
      const tempoObj = Tempos.slice(0);

      addAnswersToDB("perguntas5", {
        userId: userId,
        answerObj: answerObj,
        tempoObj: tempoObj,
      });
    }
  };

  function playSound(image: string) {
    const audio = new Audio(`/snd/${image}.mp3`);
    audio.play();
    console.log("playing sound:" + `/snd/${image}.mp3`);
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
        <div className="container">
          <div>
            <Syllable image={imageMain} />
            <div className="meio"></div>
            <Images
              images={imagesSec[currentSyllableIndex]}
              onImageClick={handleImageClick}
            />
          </div>
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
        <GameOverScreen onNextgame={() => navigate("/Resultados")} />
      )}
    </AnimatedPages>
  );
};

export default Sons;

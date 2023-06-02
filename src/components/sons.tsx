import React, { useState } from "react";
import "../css/sons.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
const respostas5: string[] = [];
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

const Sons = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const navigate = useNavigate();
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  console.log(gameState);

  const imagesMain = ["Chinelo", "Sol", "Vaca", "Minhoca", "Pato"];
  const imageMainSrc = "src/img/" + imagesMain[currentSyllableIndex] + ".png";

  const imagesSec = [
    ["Chuva", "cobra"],
    ["zebra", "sapo"],
    ["fazenda", "vassoura"],
    ["milho", "ninho"],
    ["passaro", "banana"],
  ];

  const imageSecSrc = "src/img/" + imagesSec[currentSyllableIndex][0] + ".png";
  const num_correto = ["sereia", "cavalo-marinho", "sol", "camarao", "raia"];
  const imageMain = imagesMain[currentSyllableIndex];
  const soundMain = imagesMain.map((image) => `src/snd/${image}.mp3`);
  const soundSec = imagesSec.map((image) => `src/snd/${image}.mp3`);
  const imageSec = imagesSec[currentSyllableIndex];

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
          <img className="syllableImage" src={image} alt={image}></img>
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
              src={`src/img/${image}.png`}
              alt={image}
              onClick={() => onImageClick(image)}
            ></img>
          </div>
          <div>
            <img
              className="microfone"
              src="src/img/microfone.png"
              onClick={playSound}
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
      let answerObj = { userId: userId };
      respostas5.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });
      let tempoObj = { userId: userId };
      Tempos.slice(0).forEach((tempo, index) => {
        tempoObj[`tempo${index + 1}`] = tempo;
      });
      addAnswersToDB("perguntas5", { answerObj, tempoObj });
      alert("Parabéns! Você completou o jogo!");
      navigate("/Resultados");
      setCurrentSyllableIndex(0);
    }
  };

  function playSound() {
    const audio = new Audio(soundMain[currentSyllableIndex]);
    audio.play();
    console.log("playing sound:" + soundMain[currentSyllableIndex]);
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
        <div className="container">
          <div>
            <Syllable image={imageMainSrc} />
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
        <div>
          <span>Parabéns! Você completou o jogo!</span>
          <button onClick={() => navigate("/Rimas")}>Go to Image</button>
        </div>
      )}
    </AnimatedPages>
  );
};

export default Sons;

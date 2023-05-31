import React, { useState } from "react";
import "../css/sons.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
const respostas5: string[] = [];

const Sons = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const navigate = useNavigate();
  const { userId } = React.useContext(UserContext);

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
    if (currentSyllableIndex < imagesMain.length - 1) {
      setCurrentSyllableIndex(currentSyllableIndex + 1);
      console.log("currentSyllableIndex: " + currentSyllableIndex);
    } else {
      let answerObj = { userId: userId };
      respostas5.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });
      addAnswersToDB("perguntas5", answerObj);
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
    <AnimatedPages>
      {parabens && (
        <div>
          <span>Parabens!</span>
          <button onClick={handleNextPhase}>Next Syllable</button>
        </div>
      )}
      {!parabens && (
        <>
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
        </>
      )}
    </AnimatedPages>
  );
};

export default Sons;

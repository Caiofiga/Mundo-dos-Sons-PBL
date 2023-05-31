import React, { useState, useEffect } from "react";
import "../css/silaba.css";
import AnimatedPages from "./animated";
import { Navigate, useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
const resposta2: string[] = [];

const Silaba = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const { userId } = React.useContext(UserContext);

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
    if (currentSyllableIndex < palavras.length - 1) {
      setCurrentSyllableIndex(currentSyllableIndex + 1);
      console.log("currentSyllableIndex: " + currentSyllableIndex);
    } else {
      // Generate answerObj here after all answers have been added to resposta1
      let answerObj = { userId: userId };
      resposta2.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });
      addAnswersToDB("perguntas2", answerObj);
      alert("Parabéns! Você completou o jogo!");
      navigate("/Imagem");
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
    <AnimatedPages>
      {parabens && (
        <div>
          <span>Parabens!</span>
          <button onClick={handleNextPhase}>Next Syllable</button>
        </div>
      )}
      {!parabens && (
        <>
          <div>
            <Syllable syllable={syllables[currentSyllableIndex]} />
            <div className="meio"></div>
            <Pictures pictures={pictures} onPictureClick={handlePictureClick} />
          </div>
        </>
      )}
    </AnimatedPages>
  );
};

export default Silaba;

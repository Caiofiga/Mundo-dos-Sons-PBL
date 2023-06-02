import React, { useState, useEffect } from "react";
import "../css/imagem.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";

const resposta3: string[] = [];

const Imagem = () => {
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [parabens, setParabens] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [button, setbutton] = useState("button");
  const { userId } = React.useContext(UserContext);

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
    if (currentSyllableIndex < words.length - 1) {
      setCurrentSyllableIndex(currentSyllableIndex + 1);
      console.log("currentSyllableIndex: " + currentSyllableIndex);
    } else {
      let answerObj = { userId: userId };
      resposta3.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });
      addAnswersToDB("perguntas3", answerObj);
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
            <Syllable image={image} />
            <div className="meio"></div>
            <Words
              words={num_corretos[currentSyllableIndex]}
              onWordClick={handleWordClick}
            />
          </div>
        </>
      )}
    </AnimatedPages>
  );
};

export default Imagem;

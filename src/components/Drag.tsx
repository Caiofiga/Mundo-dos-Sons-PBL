import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import "../css/drag.css";
import { getConfetti } from "./congrats";
import { getFireworks } from "./congrats";
import { getStars } from "./congrats";
import AnimatedPages from "./animated";

const audioMap = {
  "tu": "/src/snd/tu.mp3",
  "ba": "/src/snd/ba.mp3",
  "rão": "/src/snd/rao.mp3",
  "lão": "/src/snd/lao.mp3",
  "pa": "/src/snd/pa.mp3",
  "tar": "/src/snd/tar.mp3",
  "lu": "/src/snd/lu.mp3",
  "ga": "/src/snd/ga.mp3",
  "ru": "/src/snd/ru.mp3",
  "tal": "/src/snd/tal.mp3",
  "lei": "/src/snd/lei.mp3",
  "a": "/src/snd/a.mp3",
  "rei": "/src/snd/rei.mp3",
  "par": "/src/snd/par.mp3",
  "bar": "/src/snd/bar.mp3",
  "to": "/src/snd/to.mp3",
  "bal": "/src/snd/bal.mp3",
  "co": "/src/snd/co.mp3",
  "ta": "/src/snd/ta.mp3",
  "bi": "/src/snd/bi.mp3",
  "pi": "/src/snd/pi.mp3",
  "ra": "/src/snd/ra.mp3",
  "la": "/src/snd/la.mp3",
};

const yaySound = "/src/snd/yay.mp3";
function playYay() {
  const audio = new Audio(yaySound);
  audio.play(); 
}

enum GameState {
  STARTING,
  RUNNING,
  BETWEEN_LEVELS,
  COMPLETED,
  LOADING
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
  <div >
  {getConfetti()}
  {getFireworks()}
  {getStars()}
  <audio src={yaySound} autoPlay />
  <div className="Congrats">
    <h1>Parabens!</h1>
    <button className="Button btn btn-outline-primary" onClick={onNextLevel}>Proxima Fase</button>
  </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div>
    <h1>Welcome to the Game!</h1>
    <button className="Button btn btn-outline-primary" onClick={onStart}>Jogar</button>
  </div>
);


const microfone = "/src/img/microfone.png";
const palavras = ["tubarão", "tartaruga", "baleia", "barco", "pirata"];
const silabas = [
  ["tu", "ba", "rão", "lão", "pa"],
  ["ta", "tar", "lu", "ga", "ru", "tal"],
  ["lei", "pa", "a", "ba", "rei"],
  ["par", "bar", "to", "bal", "co"],
  ["ta", "bi", "pi", "ra", "la"],
];

const resposta1: string[] = [];
const Tempos: number[] = [];
const stopwatch = new Stopwatch();



function generateInitialData(currentLine) {
  let initialData = {
    list1: [],
    list2: [],
  };
  let idCounter = 1;

  silabas[currentLine].forEach((syllable) => {
    initialData.list1.push({
      id: `item${idCounter}`,
      content: syllable,
      imgUrl: microfone,
      audioSrc: audioMap[syllable] || ""
    });
    idCounter++;
  });
  return initialData;
}

function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

const Drag = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [data, setData] = useState(generateInitialData(currentLine));
  const palavra = palavras[currentLine];
  const imagem = "/src/img/" + palavra + ".png";
  const navigate = useNavigate();
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);

  const getWordFromList = () => {
    return data.list2.map((item) => item.content).join("");
  };

  const startLevel = () => {
    setGameState(GameState.RUNNING);
    stopwatch.start();
  };

  const endLevel = () => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(Tempos);
    resposta1.push(getWordFromList());
    playYay();
    if(currentLine < silabas.length - 1) {
    setGameState(GameState.BETWEEN_LEVELS); // Go to BETWEEN_LEVELS state when a level ends
  }
 else {
    loadNextLine();
 } 
};

  useEffect(() => {
    setData(generateInitialData(currentLine));
  }, [currentLine]);

  const loadNextLine = () => {
    if (currentLine < silabas.length - 1) {
      setCurrentLine((line) => line + 1);
      setData(generateInitialData(currentLine + 1)); 
      setGameState(GameState.RUNNING); // Go to RUNNING state when Next Level is clicked
      console.log(resposta1);
    } else {
      setGameState(GameState.COMPLETED);
      console.log(resposta1);
      // Store resposta and tempo as arrays
      let answerObj = resposta1.slice(0);
      let tempoObj = Tempos.slice(0);

      addAnswersToDB("perguntas1", {
        userId: userId,
        answerObj: answerObj,
        tempoObj: tempoObj,
      });
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(data[source.droppableId]);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);

      setData((prevState) => ({
        ...prevState,
        [source.droppableId]: newList,
      }));
    } else {
      const sourceList = Array.from(data[source.droppableId]);
      const destinationList = Array.from(data[destination.droppableId]);
      const [draggedItem] = sourceList.splice(source.index, 1);

      destinationList.splice(destination.index, 0, draggedItem);

      setData((prevState) => ({
        ...prevState,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destinationList,
      }));
    }
  };

  const renderGameState = () => {
    switch (gameState) {
      case GameState.STARTING:
        return (
          <StartScreen
            onStart={startLevel}
          />
        );
      case GameState.RUNNING:
        return (
          <div>
            <img src={imagem} alt={palavra} style={{ width: "200px" }} />
            <DragDropContext onDragEnd={handleDragEnd}>
              {Object.keys(data).map((list) => (
                <Droppable droppableId={list} direction="horizontal" key={list}>
                  {(provided, snapshot) => (
                    <div
                      className="row-container"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        display: "flex",
                        margin: "10px",
                        padding: "10px",
                        border: "1px solid black",
                        backgroundColor: snapshot.isDraggingOver
                          ? "#e0e0e0"
                          : "white",
                      }}
                    >
                      {data[list].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              className="draggable-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <button onClick={() => playSound(item.audioSrc)}>
                                <img src={item.imgUrl} alt={item.content} className="Mic"/>
                              </button>
                              <p>{item.content}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
            <button onClick={endLevel}>
              {currentLine < silabas.length - 1 ? "Next Line" : "End Game"}
            </button>
          </div>
        );
      case GameState.BETWEEN_LEVELS:
        return (
          <BetweenLevelsScreen
            onNextLevel={loadNextLine}
          />
        );
      case GameState.COMPLETED:
        return (
          <div>
            <span>Parabéns! Você completou o jogo!</span>
            <button className="Button btn btn-outline-primary" onClick={() => navigate("/Imagem")}>Go to Image</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatedPages key={gameState}> 
      <div className="app-container">
      {renderGameState()}
      </div>
    </AnimatedPages>
  );
}

export default Drag;


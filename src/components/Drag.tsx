import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import "../css/drag.css";
import { getConfetti } from "./congrats";
import { getFireworks } from "./congrats";
import { getStars } from "./congrats";

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
  <div >
  {getConfetti()}
  {getFireworks()}
  {getStars()}
  <div className="Congrats">
    <h1>Level completed!</h1>
    <button className="Button" onClick={onNextLevel}>Next Level</button>
  </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div>
    <h1>Welcome to the Game!</h1>
    <button className="Button" onClick={onStart}>Play</button>
  </div>
);


const microfone = "/src/img/microfone.png";
const palavras = ["jabuticaba", "tartaruga", "baleia", "barco", "pirata"];
const silabas = [
  ["ba", "co", "ti", "ca", "ja", "bu", "sa"],
  ["ta", "tar", "lu", "ga", "ru", "pa"],
  ["lei", "pa", "a", "ba", "rei"],
  ["par", "bar", "co", "to"],
  ["ta", "bi", "pi", "ra", "la"],
];
const resposta1: string[] = [];
const Tempos: number[] = [];
const stopwatch = new Stopwatch();

const JaSom = "/src/snd/ja.mp3";
const BuSom = "/src/snd/bu.mp3";
const TiSom = "/src/snd/ti.mp3";

function generateInitialData(currentLine) {
  let initialData = {
    list1: [],
    list2: [],
  };
  let idCounter = 1;

  silabas[currentLine].forEach((syllable) => {
    let audioSrc;
    switch (syllable) {
      case "ja":
        audioSrc = JaSom;
        break;
      case "bu":
        audioSrc = BuSom;
        break;
      case "ti":
        audioSrc = TiSom;
        break;
      default:
        audioSrc = "";
    }

    initialData.list1.push({
      id: `item${idCounter}`,
      content: syllable,
      imgUrl: microfone,
      audioSrc: audioSrc,
      audioRef: React.createRef(),
    });
    idCounter++;
  });

  return initialData;
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
    setGameState(GameState.BETWEEN_LEVELS); // Go to BETWEEN_LEVELS state when a level ends
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
                              <button className="Button" onClick={() => item.audioRef.current.play()}>
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
            <button onClick={() => navigate("/Imagem")}>Go to Image</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container" key={gameState}>
      {renderGameState()}
    </div>
  );
}

export default Drag;


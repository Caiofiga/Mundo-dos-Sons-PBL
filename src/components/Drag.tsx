import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import "../css/drag.css";
import { GetConfetti } from "./congrats";
import { GetFireworks } from "./congrats";
import { GetStars } from "./congrats";
import AnimatedPages from "./animated";

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink']; // Add as many colors as you need

const audioMap: { [key: string]: string } = {
  tu: "/snd/tu.mp3",
  ba: "/snd/ba.mp3",
  rão: "/snd/rao.mp3",
  lão: "/snd/lao.mp3",
  pa: "/snd/pa.mp3",
  tar: "/snd/tar.mp3",
  lu: "/snd/lu.mp3",
  ga: "/snd/ga.mp3",
  ru: "/snd/ru.mp3",
  tal: "/snd/tal.mp3",
  lei: "/snd/lei.mp3",
  a: "/snd/a.mp3",
  rei: "/snd/rei.mp3",
  par: "/snd/par.mp3",
  bar: "/snd/bar.mp3",
  to: "/snd/to.mp3",
  bal: "/snd/bal.mp3",
  co: "/snd/co.mp3",
  ta: "/snd/ta.mp3",
  bi: "/snd/bi.mp3",
  pi: "/snd/pi.mp3",
  ra: "/snd/ra.mp3",
  la: "/snd/la.mp3",
};

const yaySound = "/snd/yay.mp3";
function playYay() {
  const audio = new Audio(yaySound);
  audio.play();
}

enum GameState {
  STARTING,
  RUNNING,
  BETWEEN_LEVELS,
  COMPLETED,
  LOADING,
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

const BetweenLevelsScreen: React.FC<BetweenLevelsScreenProps> = ({
  onNextLevel,
}) => (
  <div>
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <div className="Congrats">
      <h1>Parabéns!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextLevel}>
        Próxima Fase
      </button>
    </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div>
    <img src="/img/BGDrag.jpg" />
    <h1>Desafio 5: Forme a palavra</h1>
    <button className="Button btn btn-outline-primary" onClick={onStart}>
      Jogar
    </button>
  </div>
);

const GameOverScreen: React.FC<GameOverProps> = ({ onNextgame }) => (
  <div>
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <div className="Complete">
      <h1>Fim de Jogo!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextgame}>
        Obrigado por Jogar!
      </button>
    </div>
  </div>
);

const microfone = "/img/mic.png";
const palavras = ["tubarão", "tartaruga", "baleia", "barco", "pirata"];
const silabas = [
  ["pa", "lão", "rão", "ba", "tu"],
  ["ta", "tar", "lu", "ga", "ru", "tal"],
  ["lei", "pa", "a", "ba", "rei"],
  ["par", "bar", "to", "bal", "co"],
  ["ta", "bi", "pi", "ra", "la"],
];

const resposta1: string[] = [];
const Tempos: number[] = [];
const stopwatch = new Stopwatch();

type ListItem = {
  id: string;
  content: string;
  imgUrl: string;
  audioSrc: string;
};

function generateInitialData(currentLine: number) {
  const initialData: { list1: ListItem[]; list2: ListItem[] } = {
    list1: [],
    list2: [],
  };
  let idCounter = 1;

  silabas[currentLine].forEach((syllable) => {
    initialData.list1.push({
      id: `item${idCounter}`,
      content: syllable,
      imgUrl: microfone,
      audioSrc: audioMap[syllable] || "",
    });
    idCounter++;
  });

  return initialData;
}

interface Data {
  [key: string]: ListItem[];
}

function playSound(src: string) {
  const audio = new Audio(src);
  audio.play();
}

const Drag = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [data, setData] = useState<Data>(generateInitialData(currentLine));
  const palavra = palavras[currentLine];
  const imagem = "/img/" + palavra + ".png";
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
    if (currentLine < silabas.length - 1) {
      setGameState(GameState.BETWEEN_LEVELS); // Go to BETWEEN_LEVELS state when a level ends
    } else {
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
      stopwatch.start();
      console.log(resposta1);
    } else {
      setGameState(GameState.COMPLETED);
      console.log(resposta1);
      // Store resposta and tempo as arrays
      const answerObj = resposta1.slice(0);
      const tempoObj = Tempos.slice(0);

      addAnswersToDB("perguntas1", {
        userId: userId,
        answerObj: answerObj,
        tempoObj: tempoObj,
      });
    }
  };

  type DroppableId = "list1" | "list2";

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceDroppableId: DroppableId = source.droppableId as DroppableId;
    const destinationDroppableId: DroppableId =
      destination.droppableId as DroppableId;

    if (sourceDroppableId === destinationDroppableId) {
      const newList = Array.from(data[sourceDroppableId]);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);

      setData((prevState) => ({
        ...prevState,
        [sourceDroppableId]: newList,
      }));
    } else {
      const sourceList = Array.from(data[sourceDroppableId]);
      const destinationList = Array.from(data[destinationDroppableId]);
      const [draggedItem] = sourceList.splice(source.index, 1);

      destinationList.splice(destination.index, 0, draggedItem);

      setData((prevState) => ({
        ...prevState,
        [sourceDroppableId]: sourceList,
        [destinationDroppableId]: destinationList,
      }));
    }
  };

  function idToColor(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  const renderGameState = () => {
    switch (gameState) {
      case GameState.STARTING:
        return <StartScreen onStart={startLevel} />;
      case GameState.RUNNING:
        return (
          <div>
            <img src={imagem} alt={palavra} style={{ height: "300px" }} />
            <DragDropContext onDragEnd={handleDragEnd}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {Object.keys(data).map((list) => (
                  <Droppable
                    droppableId={list}
                    direction="horizontal"
                    key={list}
                  >
                    {(provided, snapshot) => (
                      <div
                        className="row-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "10px",
                          padding: "10px",
                          border: "1px solid black",
                          backgroundColor: snapshot.isDraggingOver
                            ? "#e0e0e0"
                            : "white",
                          minWidth: "200px",
                          minHeight: "200px",
                          alignItems: "center",
                        }}
                      >
                        {data[list].map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="draggable-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <button
                                  className="btn btn-primary"
                                  style={{backgroundColor: idToColor(item.id), borderColor: idToColor(item.id)}}                                  onClick={() => playSound(item.audioSrc)}
                                >
                                  <img
                                    src={item.imgUrl}
                                    alt={item.content}
                                    className="Mic"
                                  />
                                </button>
                                <p className="getout">{item.content}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
            <button className="btn btn-outline-success" onClick={endLevel}>
              {currentLine < silabas.length - 1 ? "Finalizar" : "Finalizar"}
            </button>
          </div>
        );
      case GameState.BETWEEN_LEVELS:
        return <BetweenLevelsScreen onNextLevel={loadNextLine} />;
      case GameState.COMPLETED:
        return <GameOverScreen onNextgame={() => navigate("/Silaba")} />;
      default:
        return null;
    }
  };

  return (
    <AnimatedPages key={gameState}>
      <div className="app-container">{renderGameState()}</div>
    </AnimatedPages>
  );
};

export default Drag;

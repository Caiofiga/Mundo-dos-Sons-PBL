import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { get } from "http";
import { addAnswersToDB } from "./firebase";

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
      audioRef: React.createRef(), // Add this line
    });
    idCounter++;
  });

  return initialData;
}

function Drag() {
  const [currentLine, setCurrentLine] = useState(0);
  const [data, setData] = useState(generateInitialData(currentLine));
  const palavra = palavras[currentLine];
  const imagem = "/src/img/" + palavra + ".png";
  const navigate = useNavigate();
  const { userId } = React.useContext(UserContext);

  const getWordFromList = () => {
    return data.list2.map((item) => item.content).join("");
  };

  const loadNextLine = () => {
    console.log(getWordFromList());
    if (currentLine < silabas.length - 1) {
      setCurrentLine(currentLine + 1);
      setData(generateInitialData(currentLine + 1));
      resposta1.push(getWordFromList());
      console.log(resposta1);
    } else {
      // navigate to the next component
      resposta1.push(getWordFromList());
      // Generate answerObj here after all answers have been added to resposta1
      let answerObj = { userId: userId };
      resposta1.slice(0).forEach((answer, index) => {
        answerObj[`resposta${index + 1}`] = answer;
      });

      addAnswersToDB("perguntas1", answerObj);
      alert("Parabéns! Você completou o jogo!");
      navigate("/Silaba"); // replace "/Silaba" with the path of the next component you want to navigate to
    }
  };

  useEffect(() => {
    setData(generateInitialData(currentLine));
  }, [currentLine]);

  function handleDragEnd(result) {
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
  }

  return (
    <div className="app-container">
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
                {data[list].map((item, index) => {
                  const handlePlaySound = () => {
                    item.audioRef.current.play();
                  };

                  return (
                    <Draggable
                      draggableId={item.id}
                      index={index}
                      key={item.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                        >
                          <img
                            src={item.imgUrl}
                            alt={item.content}
                            style={{ width: "50px", height: "50px" }}
                            onClick={handlePlaySound}
                          />
                          {item.content}
                          <audio
                            ref={item.audioRef}
                            src={item.audioSrc}
                            style={{ display: "none" }}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <button onClick={loadNextLine}>
        {currentLine < silabas.length - 1 ? "Próxima linha" : "Next Level"}
      </button>
    </div>
  );
}

export default Drag;

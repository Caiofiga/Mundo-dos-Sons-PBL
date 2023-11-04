import React, { useState } from "react";
import "../css/prototype.css";
import AnimatedPages from "./animated";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { addAnswersToDB } from "./firebase";
import { Stopwatch } from "ts-stopwatch";
import { GetConfetti, GetFireworks, GetStars } from "./congrats";
import ReactPlayer from "react-player";
import "bootstrap/dist/css/bootstrap.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const resposta3: number[] = [];

const Tempos: number[] = [];
const stopwatch = new Stopwatch();

enum GameState {
  STARTING,
  RUNNING,
  BETWEEN_LEVELS,
  VIDEO,
  COMPLETED,
}

enum AnswerState {
  OFF,
  INCORRECT,
  CORRECT,
  SEMICORRECT,
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

interface VideoProps {
  onVideoEnd: () => void;
}

const VideoScreen: React.FC<VideoProps> = ({ onVideoEnd }) => (
  <div
    className="Videome"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      backgroundColor: "black",
    }}
  >
    <ReactPlayer
      url="https://youtu.be/iFuDg96IWKU"
      playing={true}
      onEnded={onVideoEnd}
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  </div>
);

const GameOverScreen: React.FC<GameOverProps> = ({ onNextgame }) => (
  <div className="app-container">
    {GetConfetti()}
    {GetFireworks()}
    {GetStars()}
    <img className="overandout" src="/img/color2.png" alt="Game Over" />
    <div className="Complete">
      <h1>
        <b>Fase Completa!</b>
      </h1>
      <button className="Button btn btn-primary" onClick={onNextgame}>
        Próximo Jogo
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
      <h1>Parabéns!</h1>
      <button className="Button btn btn-outline-primary" onClick={onNextLevel}>
        Próxima Fase ⏩
      </button>
    </div>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <div
    className="appContainer"
    style={{ backgroundImage: `url(/img/color1.png)` }}
  >
    <h1>
      <b>Desafio 3: Conte as Sílabas</b>
    </h1>
    <button className="btn btn-success" onClick={onStart}>
      Jogar
    </button>
  </div>
);

const Prot = () => {
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
  const { userId } = React.useContext(UserContext);
  const [gameState, setGameState] = useState<GameState>(GameState.STARTING);
  const [answerState, setAnswerState] = useState<AnswerState>(AnswerState.OFF);

  console.log(gameState);

  // Now you can use userId in this component

  const questions = ["dentes", "borboleta", "pássaro", "abelha", "onça"];
  const image = "/img/" + questions[currentQuestionNum] + ".png";

  const alternativas = [
    [0, 1, 2, 3],
    [3, 4, 5, 6],
    [2, 4, 3, 5],
    [4, 2, 5, 3],
    [2, 1, 3, 4],
  ];
  const res_correta = [3, 4, 3, 4, 4];
  const question = questions[currentQuestionNum];
  const sound = questions.map((word) => `/snd/${word}q.mp3`);
  const navigate = useNavigate();

  const Incorrect: React.FC = () => (
    <Popup open={true} onClose={() => handleNextPhase()} modal>
      <div>Que triste!</div>{" "}
      <div> É importante escovar os dentes pelo menos 3 vezes ao dia.</div>{" "}
    </Popup>
  );
  const Semicorrect: React.FC = () => (
    <Popup open={true} onClose={() => handleNextPhase()} modal>
      <div>Que bom!</div>{" "}
      <div>
        {" "}
        Você esta no caminho certo, mas precisa escovar mais, pelo menos 3 vezes
        ao dia.
      </div>{" "}
    </Popup>
  );
  const Correct: React.FC = () => (
    <Popup open={true} onClose={() => handleNextPhase()} modal>
      <div>Perfeito!</div>{" "}
      <div> Você escova os dentes 3 vezes ao dia, parabéns!</div>{" "}
    </Popup>
  );

  interface QuestionProps {
    image: string;
  }

  const Question: React.FC<QuestionProps> = ({ image }) => (
    <div>
      <div className="question">
        <span>
          <img
            className="microfone"
            src="/img/mic.png"
            onClick={playSound}
          ></img>
          <img className="questionImage" src={image} alt={question}></img>
        </span>
      </div>
    </div>
  );

  interface AnswerProps {
    answers: number[];
    onAnswerClick: (answer: number) => void;
  }

  const Answers: React.FC<AnswerProps> = ({ answers, onAnswerClick }) => (
    <div className="answers">
      {answers.map((answer, index) => (
        <div
          className="circle"
          key={index}
          onClick={() => onAnswerClick(answer)}
        >
          {answer}
        </div>
      ))}
    </div>
  );
  const handleAnswerClick = (answer: number) => {
    stopwatch.stop();
    Tempos.push(stopwatch.getTime());
    stopwatch.reset();
    console.log(answer);
    resposta3.push(answer);
    //check answer
    if (answer === res_correta[currentQuestionNum]) {
      setAnswerState(AnswerState.CORRECT);
    } else if (
      answer === res_correta[currentQuestionNum] - 2 ||
      answer === res_correta[currentQuestionNum] + 2
    ) {
      setAnswerState(AnswerState.SEMICORRECT);
    } else {
      setAnswerState(AnswerState.INCORRECT);
    }
  };

  const handleNextPhase = () => {
    console.log(Tempos);
    if (currentQuestionNum < questions.length - 1) {
      switch (answerState) {
        case AnswerState.CORRECT:
          setGameState(GameState.BETWEEN_LEVELS);
          break;
        case AnswerState.SEMICORRECT:
          setCurrentQuestionNum(currentQuestionNum + 1);
          setGameState(GameState.RUNNING);
          break;
        case AnswerState.INCORRECT:
          setCurrentQuestionNum(currentQuestionNum + 1);
          setGameState(GameState.RUNNING);
          break;
      }
      setAnswerState(AnswerState.OFF);
    } else {
      setGameState(GameState.VIDEO);
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
    const audio = new Audio(sound[currentQuestionNum]);
    audio.play();
    console.log("playing sound:" + sound[currentQuestionNum]);
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
          <Question image={image} />
          <div className="meio"></div>
          <Answers
            answers={alternativas[currentQuestionNum]}
            onAnswerClick={handleAnswerClick}
          />
          {answerState === AnswerState.INCORRECT && <Incorrect />}
          {answerState === AnswerState.SEMICORRECT && <Semicorrect />}
          {answerState === AnswerState.CORRECT && <Correct />}
        </div>
      )}
      {gameState === GameState.BETWEEN_LEVELS && (
        <BetweenLevelsScreen
          onNextLevel={() => {
            setGameState(GameState.RUNNING);
            setCurrentQuestionNum(currentQuestionNum + 1);
            stopwatch.start();
          }}
        />
      )}
      {gameState === GameState.VIDEO && (
        <VideoScreen onVideoEnd={() => setGameState(GameState.COMPLETED)} />
      )}
      {gameState === GameState.COMPLETED && (
        <div>
          <GameOverScreen onNextgame={() => navigate("/Rimas")} />
        </div>
      )}
    </AnimatedPages>
  );
};

export default Prot;

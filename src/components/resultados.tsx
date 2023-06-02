import React, { useState, useEffect } from "react";
import { Tab, Tabs, Box, Grid } from "@mui/material";
import { getDocsByUserId } from "./firebase";
import { db } from "./firebase"; // Assuming your Firestore db instance is exported from 'firebase.tsx'
import "../css/resultados.css";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

interface User {
  resposta1: string;
  resposta2: string;
  resposta3: string;
  resposta4: string;
  resposta5: string;
  resposta6: string;
  resposta7: string;
  resposta8: string;
  resposta9: string;
}

function isAnswerCorrect(
  userAnswer: string | number,
  correctAnswer: string | number
) {
  return (
    String(userAnswer).toLowerCase() === correctAnswer.toString().toLowerCase()
  );
}

export default function SimpleTabs({ userId }) {
  const [userDataCollection1, setUserDataCollection1] = useState<User[]>([]);
  const [userDataCollection2, setUserDataCollection2] = useState<User[]>([]);
  const [userDataCollection3, setUserDataCollection3] = useState<User[]>([]);
  const [userDataCollection4, setUserDataCollection4] = useState<User[]>([]);
  const [userDataCollection5, setUserDataCollection5] = useState<User[]>([]);
  const [userDataCollection6, setUserDataCollection6] = useState<User[]>([]);

  const [acertos1, setAcertos1] = useState(0);
  const [acertos2, setAcertos2] = useState(0);
  const [acertos3, setAcertos3] = useState(0);
  const [acertos4, setAcertos4] = useState(0);
  const [acertos5, setAcertos5] = useState(0);

  function increaseAcertos1() {
    setAcertos1(acertos1 + 1);
  }
  function increaseAcertos2() {
    setAcertos2(acertos2 + 1);
  }
  function increaseAcertos3() {
    setAcertos3(acertos3 + 1);
  }
  function increaseAcertos4() {
    setAcertos4(acertos4 + 1);
  }
  function increaseAcertos5() {
    setAcertos5(acertos5 + 1);
  }
  // add more state variables if you need to fetch from more collections

  useEffect(() => {
    async function fetchData() {
      const data1 = await getDocsByUserId("perguntas1", userId);
      const data2 = await getDocsByUserId("perguntas2", userId);
      const data3 = await getDocsByUserId("perguntas3", userId);
      const data4 = await getDocsByUserId("perguntas4", userId);
      const data5 = await getDocsByUserId("perguntas5", userId);
      const data6 = await getDocsByUserId("users", userId);
      // add more fetch calls if you have more collections

      setUserDataCollection1(data1);
      setUserDataCollection2(data2);
      setUserDataCollection3(data3);
      setUserDataCollection4(data4);
      setUserDataCollection5(data5);
      setUserDataCollection6(data6);
      console.log(data6);

      data1.forEach((doc) => {
        if (isAnswerCorrect(doc.resposta1, CorrectAnswers1[0])) {
          setAcertos1(acertos1 + 1);
        }
        if (isAnswerCorrect(doc.resposta2, CorrectAnswers1[1])) {
          setAcertos1(acertos1 + 1);
        }
        if (isAnswerCorrect(doc.resposta3, CorrectAnswers1[2])) {
          setAcertos1(acertos1 + 1);
        }
        if (isAnswerCorrect(doc.resposta4, CorrectAnswers1[3])) {
          setAcertos1(acertos1 + 1);
        }
        if (isAnswerCorrect(doc.resposta5, CorrectAnswers1[4])) {
          setAcertos1(acertos1 + 1);
        }
      });
      data2.forEach((doc) => {
        if (isAnswerCorrect(doc.resposta1, CorrectAnswers2[0])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta2, CorrectAnswers2[1])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta3, CorrectAnswers2[2])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta4, CorrectAnswers2[3])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta5, CorrectAnswers2[4])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta6, CorrectAnswers2[5])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta7, CorrectAnswers2[6])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta8, CorrectAnswers2[7])) {
          setAcertos2(acertos2 + 1);
        }
        if (isAnswerCorrect(doc.resposta9, CorrectAnswers2[8])) {
          setAcertos2(acertos2 + 1);
        }
      });
      data3.forEach((doc) => {
        if (isAnswerCorrect(doc.resposta1, CorrectAnswers3[0])) {
          setAcertos3(acertos3 + 1);
        }
        if (isAnswerCorrect(doc.resposta2, CorrectAnswers3[1])) {
          setAcertos3(acertos3 + 1);
        }
        if (isAnswerCorrect(doc.resposta3, CorrectAnswers3[2])) {
          setAcertos3(acertos3 + 1);
        }
        if (isAnswerCorrect(doc.resposta4, CorrectAnswers3[3])) {
          setAcertos3(acertos3 + 1);
        }
        if (isAnswerCorrect(doc.resposta5, CorrectAnswers3[4])) {
          setAcertos3(acertos3 + 1);
        }
      });
      data4.forEach((doc) => {
        if (isAnswerCorrect(doc.resposta1, CorrectAnswers4[0])) {
          setAcertos4(acertos4 + 1);
        }
        if (isAnswerCorrect(doc.resposta2, CorrectAnswers4[1])) {
          setAcertos4(acertos4 + 1);
        }
        if (isAnswerCorrect(doc.resposta3, CorrectAnswers4[2])) {
          setAcertos4(acertos4 + 1);
        }
        if (isAnswerCorrect(doc.resposta4, CorrectAnswers4[3])) {
          setAcertos4(acertos4 + 1);
        }
        if (isAnswerCorrect(doc.resposta5, CorrectAnswers4[4])) {
          setAcertos4(acertos4 + 1);
        }
      });
      data5.forEach((doc) => {
        if (isAnswerCorrect(doc.resposta1, CorrectAnswers5[0])) {
          setAcertos5(acertos5 + 1);
        }
        if (isAnswerCorrect(doc.resposta2, CorrectAnswers5[1])) {
          setAcertos5(acertos5 + 1);
        }
        if (isAnswerCorrect(doc.resposta3, CorrectAnswers5[2])) {
          setAcertos5(acertos5 + 1);
        }
        if (isAnswerCorrect(doc.resposta4, CorrectAnswers5[3])) {
          setAcertos5(acertos5 + 1);
        }
        if (isAnswerCorrect(doc.resposta5, CorrectAnswers5[4])) {
          setAcertos5(acertos5 + 1);
        }
      });
    }
    console.log("Acertos1: " + acertos1);
    console.log("Acertos2: " + acertos2);
    console.log("Acertos3: " + acertos3);
    console.log("Acertos4: " + acertos4);
    console.log("Acertos5: " + acertos5);

    fetchData();
  }, [userId]);

  const CorrectAnswers1: string[] = [
    "Jabuticaba",
    "tartaruga",
    "baleia",
    "barco",
    "pirata",
  ];
  const CorrectAnswers2: string[] = [
    "Macaco",
    "buraco",
    "lago",
    "cavalo",
    "milho",
    "fonte",
    "arvore",
    "vulcao",
    "aranha",
  ];
  const CorrectAnswers3: number[] = [3, 4, 3, 3, 2];

  const CorrectAnswers4: string[] = [
    "Sereia",
    "cavalo-marinho",
    "sol",
    "camarao",
    "raia",
  ];
  const CorrectAnswers5: string[] = [
    "chuva",
    "sapo",
    "vassoura",
    "milho",
    "passaro",
  ];

  // Function to check answer
  function checkAnswer(
    userAnswer: string | number,
    correctAnswer: string | number
  ) {
    if (
      String(userAnswer).toLowerCase() ===
      correctAnswer.toString().toLowerCase()
    ) {
      return (
        <span className="correct">
          {" "}
          <CheckIcon />{" "}
        </span>
      );
    } else {
      return (
        <span className="incorrect">
          {" "}
          <ClearIcon />{" "}
        </span>
      );
    }
  }

  function calculatePercentage(acertos: number, total: string[] | number[]) {
    const totals = total.length;
    const percentage = (acertos / totals) * 100;
    return percentage;
  }
  console.log("Acertos1: " + acertos1);
  console.log("Acertos2: " + acertos2);
  console.log("Acertos3: " + acertos3);
  console.log("Acertos4: " + acertos4);
  console.log("Acertos5: " + acertos5);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box
        sx={{ border: 1, borderRadius: 20, borderColor: "white", padding: 2 }}
      >
        <h2> Dados do usuario: </h2>
        {userDataCollection6.map((user, index) => (
          <div key={index}>
            <p>Nome: {user.nome} </p>
            <p>Sobrenome: {user.sobrenome} </p>
          </div>
        ))}
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Pergunta 1" />
          <Tab label="Pergunta 2" />
          <Tab label="Pergunta 3" />
          <Tab label="Pergunta 4" />
          <Tab label="Pergunta 5" />
          {/* More Tabs if needed */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {userDataCollection1.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <p>
                Resposta 1: {user.resposta1}{" "}
                {checkAnswer(user.resposta1, CorrectAnswers1[0])}
                {!isAnswerCorrect(user.resposta1, CorrectAnswers1[0])
                  ? ` Resposta correta: ${CorrectAnswers1[0]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 2: {user.resposta2}{" "}
                {checkAnswer(user.resposta2, CorrectAnswers1[1])}
                {!isAnswerCorrect(user.resposta2, CorrectAnswers1[1])
                  ? ` Resposta correta: ${CorrectAnswers1[1]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 3: {user.resposta3}{" "}
                {checkAnswer(user.resposta3, CorrectAnswers1[2])}
                {!isAnswerCorrect(user.resposta3, CorrectAnswers1[2])
                  ? ` Resposta correta: ${CorrectAnswers1[2]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 4: {user.resposta4}{" "}
                {checkAnswer(user.resposta4, CorrectAnswers1[3])}
                {!isAnswerCorrect(user.resposta4, CorrectAnswers1[3])
                  ? ` Resposta correta: ${CorrectAnswers1[3]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 5: {user.resposta5}{" "}
                {checkAnswer(user.resposta5, CorrectAnswers1[4])}
                {!isAnswerCorrect(user.resposta5, CorrectAnswers1[4])
                  ? ` Resposta correta: ${CorrectAnswers1[4]}`
                  : "\u00A0"}
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3>Percentage of correct answers: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos1, CorrectAnswers1)}
                    text={`${calculatePercentage(acertos1, CorrectAnswers1)}%`}
                  />
                </div>
              </p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {userDataCollection2.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.resposta1}{" "}
                  {checkAnswer(user.resposta1, CorrectAnswers2[0])}
                  {!isAnswerCorrect(user.resposta1, CorrectAnswers2[0])
                    ? ` Resposta correta: ${CorrectAnswers2[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.resposta2}{" "}
                  {checkAnswer(user.resposta2, CorrectAnswers2[1])}
                  {!isAnswerCorrect(user.resposta2, CorrectAnswers2[1])
                    ? ` Resposta correta: ${CorrectAnswers2[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.resposta3}{" "}
                  {checkAnswer(user.resposta3, CorrectAnswers2[2])}
                  {!isAnswerCorrect(user.resposta3, CorrectAnswers2[2])
                    ? ` Resposta correta: ${CorrectAnswers2[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.resposta4}{" "}
                  {checkAnswer(user.resposta4, CorrectAnswers2[3])}
                  {!isAnswerCorrect(user.resposta4, CorrectAnswers2[3])
                    ? ` Resposta correta: ${CorrectAnswers2[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.resposta5}{" "}
                  {checkAnswer(user.resposta5, CorrectAnswers2[4])}
                  {!isAnswerCorrect(user.resposta5, CorrectAnswers2[4])
                    ? ` Resposta correta: ${CorrectAnswers2[4]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 6: {user.resposta6}{" "}
                  {checkAnswer(user.resposta6, CorrectAnswers2[5])}
                  {!isAnswerCorrect(user.resposta6, CorrectAnswers2[5])
                    ? ` Resposta correta: ${CorrectAnswers2[5]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 7: {user.resposta7}{" "}
                  {checkAnswer(user.resposta7, CorrectAnswers2[6])}
                  {!isAnswerCorrect(user.resposta7, CorrectAnswers2[6])
                    ? ` Resposta correta: ${CorrectAnswers2[6]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 8: {user.resposta8}{" "}
                  {checkAnswer(user.resposta8, CorrectAnswers2[7])}
                  {!isAnswerCorrect(user.resposta8, CorrectAnswers2[7])
                    ? ` Resposta correta: ${CorrectAnswers2[7]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 9: {user.resposta9}{" "}
                  {checkAnswer(user.resposta9, CorrectAnswers2[8])}
                  {!isAnswerCorrect(user.resposta9, CorrectAnswers2[8])
                    ? ` Resposta correta: ${CorrectAnswers2[8]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Percentage of correct answers: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos2, CorrectAnswers2)}
                    text={`${calculatePercentage(acertos2, CorrectAnswers2)}%`}
                  />
                </div>
              </p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <h2>Pergunta 3</h2>
        {userDataCollection3.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.resposta1}{" "}
                  {checkAnswer(user.resposta1, CorrectAnswers3[0])}
                  {!isAnswerCorrect(user.resposta1, CorrectAnswers3[0])
                    ? ` Resposta correta: ${CorrectAnswers3[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.resposta2}{" "}
                  {checkAnswer(user.resposta2, CorrectAnswers3[1])}
                  {!isAnswerCorrect(user.resposta2, CorrectAnswers3[1])
                    ? ` Resposta correta: ${CorrectAnswers3[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.resposta3}{" "}
                  {checkAnswer(user.resposta3, CorrectAnswers3[2])}
                  {!isAnswerCorrect(user.resposta3, CorrectAnswers3[2])
                    ? ` Resposta correta: ${CorrectAnswers3[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.resposta4}{" "}
                  {checkAnswer(user.resposta4, CorrectAnswers3[3])}
                  {!isAnswerCorrect(user.resposta4, CorrectAnswers3[3])
                    ? ` Resposta correta: ${CorrectAnswers3[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.resposta5}{" "}
                  {checkAnswer(user.resposta5, CorrectAnswers3[4])}
                  {!isAnswerCorrect(user.resposta5, CorrectAnswers3[4])
                    ? ` Resposta correta: ${CorrectAnswers3[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Percentage of correct answers: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos3, CorrectAnswers3)}
                    text={`${calculatePercentage(acertos3, CorrectAnswers3)}%`}
                  />
                </div>
              </p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={3}>
        <h2>Pergunta 4</h2>
        {userDataCollection4.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.resposta1}{" "}
                  {checkAnswer(user.resposta1, CorrectAnswers4[0])}
                  {!isAnswerCorrect(user.resposta1, CorrectAnswers4[0])
                    ? ` Resposta correta: ${CorrectAnswers4[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.resposta2}{" "}
                  {checkAnswer(user.resposta2, CorrectAnswers4[1])}
                  {!isAnswerCorrect(user.resposta2, CorrectAnswers4[1])
                    ? ` Resposta correta: ${CorrectAnswers4[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.resposta3}{" "}
                  {checkAnswer(user.resposta3, CorrectAnswers4[2])}
                  {!isAnswerCorrect(user.resposta3, CorrectAnswers4[2])
                    ? ` Resposta correta: ${CorrectAnswers4[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.resposta4}{" "}
                  {checkAnswer(user.resposta4, CorrectAnswers4[3])}
                  {!isAnswerCorrect(user.resposta4, CorrectAnswers4[3])
                    ? ` Resposta correta: ${CorrectAnswers4[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.resposta5}{" "}
                  {checkAnswer(user.resposta5, CorrectAnswers4[4])}
                  {!isAnswerCorrect(user.resposta5, CorrectAnswers4[4])
                    ? ` Resposta correta: ${CorrectAnswers4[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Percentage of correct answers: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos4, CorrectAnswers4)}
                    text={`${calculatePercentage(acertos4, CorrectAnswers4)}%`}
                  />
                </div>
              </p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <h2>Pergunta 5</h2>
        {userDataCollection5.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.resposta1}{" "}
                  {checkAnswer(user.resposta1, CorrectAnswers5[0])}
                  {!isAnswerCorrect(user.resposta1, CorrectAnswers5[0])
                    ? ` Resposta correta: ${CorrectAnswers5[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.resposta2}{" "}
                  {checkAnswer(user.resposta2, CorrectAnswers5[1])}
                  {!isAnswerCorrect(user.resposta2, CorrectAnswers5[1])
                    ? ` Resposta correta: ${CorrectAnswers5[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.resposta3}{" "}
                  {checkAnswer(user.resposta3, CorrectAnswers5[2])}
                  {!isAnswerCorrect(user.resposta3, CorrectAnswers5[2])
                    ? ` Resposta correta: ${CorrectAnswers5[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.resposta4}{" "}
                  {checkAnswer(user.resposta4, CorrectAnswers5[3])}
                  {!isAnswerCorrect(user.resposta4, CorrectAnswers5[3])
                    ? ` Resposta correta: ${CorrectAnswers5[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.resposta5}{" "}
                  {checkAnswer(user.resposta5, CorrectAnswers5[4])}
                  {!isAnswerCorrect(user.resposta5, CorrectAnswers5[4])
                    ? ` Resposta correta: ${CorrectAnswers5[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Percentage of correct answers: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos5, CorrectAnswers5)}
                    text={`${calculatePercentage(acertos5, CorrectAnswers5)}%`}
                  />
                </div>
              </p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
    </div>
  );
}

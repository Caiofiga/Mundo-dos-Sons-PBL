import React, { useState, useEffect } from "react";
import { Tab, Tabs, Box, Grid } from "@mui/material";
import { getDocsByUserId } from "./firebase";
import "../css/resultados.css";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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


interface TabPanelProps {
  children?: React.ReactNode;
  index: unknown;
  value: unknown;
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
  nome: string;
  sobrenome: string;
  userId: string;
  resposta1: string;
  resposta2: string;
  resposta3: string;
  resposta4: string;
  resposta5: string;
  resposta6: string;
  resposta7: string;
  resposta8: string;
  resposta9: string;
  answerObj: string[];
  tempoObj: number[];
}
const Times1: number[] = [];
const Times2: number[] = [];
const Times3: number[] = [];
const Times4: number[] = [];
const Times5: number[] = [];

export default function SimpleTabs({ userId }: { userId: string }) {
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

  function isAnswerCorrect(
    userAnswer: string | number,
    correctAnswer: string | number
  ) {
    return (
      String(userAnswer).toLowerCase() ===
      correctAnswer.toString().toLowerCase()
    );
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

      let newAcertos1 = 0;
      let newAcertos2 = 0;
      let newAcertos3 = 0;
      let newAcertos4 = 0;
      let newAcertos5 = 0;

      data1.forEach((doc) => {
        doc.tempoObj.forEach((tempo:number) => {
          const tempos = tempo / 1000;
          Times1.push(tempos);
        });
        console.log(Times1);
      });
      data2.forEach((doc) => {
        doc.tempoObj.forEach((tempo:number) => {
          const tempos = tempo / 1000;
          Times2.push(tempos);
        });
        console.log(Times2);
      });
      data3.forEach((doc) => {
        doc.tempoObj.forEach((tempo:number) => {
          const tempos = tempo / 1000;
          Times3.push(tempos);
        });
        console.log(Times3);
      });
      data4.forEach((doc) => {
        doc.tempoObj.forEach((tempo:number) => {
          const tempos = tempo / 1000;
          Times4.push(tempos);
        });
        console.log(Times4);
      });
      data5.forEach((doc) => {
        doc.tempoObj.forEach((tempo:number) => {
          const tempos = tempo / 1000;
          Times5.push(tempos);
        });
        console.log(Times5);
      });

      data1.forEach((doc) => {
        doc.answerObj.forEach((resposta: string, index: number) => {
          if (isAnswerCorrect(resposta, CorrectAnswers1[index])) {
            newAcertos1++;
          }
        });
      });

      data2.forEach((doc) => {
        doc.answerObj.forEach((resposta: string, index: number) => {
          if (isAnswerCorrect(resposta, CorrectAnswers2[index])) {
            newAcertos2++;
          }
        });
      });

      data3.forEach((doc) => {
        doc.answerObj.forEach((resposta: string, index: number) => {
          if (isAnswerCorrect(resposta, CorrectAnswers3[index])) {
            newAcertos3++;
          }
        });
      });

      data4.forEach((doc) => {
        doc.answerObj.forEach((resposta: string, index: number) => {
          if (isAnswerCorrect(resposta, CorrectAnswers4[index])) {
            newAcertos4++;
          }
        });
      });

      data5.forEach((doc) => {
        doc.answerObj.forEach((resposta: string, index: number) => {
          if (isAnswerCorrect(resposta, CorrectAnswers5[index])) {
            newAcertos5++;
          }
        });
      });

      setUserDataCollection1(data1);
      setUserDataCollection2(data2);
      setUserDataCollection3(data3);
      setUserDataCollection4(data4);
      setUserDataCollection5(data5);
      setUserDataCollection6(data6);

      setAcertos1(newAcertos1);
      setAcertos2(newAcertos2);
      setAcertos3(newAcertos3);
      setAcertos4(newAcertos4);
      setAcertos5(newAcertos5);
    }
    fetchData();
  }, [userId]);

 
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
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.ChangeEvent<NonNullable<unknown>>, newValue: number) => {
    setValue(newValue);
  };
  console.log(Times1[0]);

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
        <Tabs value={value} onChange={(event: React.ChangeEvent<NonNullable<unknown>>, newValue: number) => handleChange(event as React.ChangeEvent<{ object: string }>, newValue)}>
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
                Resposta 1: {user.answerObj[0]}{" "}
                {checkAnswer(user.answerObj[0], CorrectAnswers1[0])}
                {!isAnswerCorrect(user.answerObj[0], CorrectAnswers1[0])
                  ? ` Resposta correta: ${CorrectAnswers1[0]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 2: {user.answerObj[1]}{" "}
                {checkAnswer(user.answerObj[1], CorrectAnswers1[1])}
                {!isAnswerCorrect(user.answerObj[1], CorrectAnswers1[1])
                  ? ` Resposta correta: ${CorrectAnswers1[1]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 3: {user.answerObj[2]}{" "}
                {checkAnswer(user.answerObj[2], CorrectAnswers1[2])}
                {!isAnswerCorrect(user.answerObj[2], CorrectAnswers1[2])
                  ? ` Resposta correta: ${CorrectAnswers1[2]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 4: {user.answerObj[3]}{" "}
                {checkAnswer(user.answerObj[3], CorrectAnswers1[3])}
                {!isAnswerCorrect(user.answerObj[3], CorrectAnswers1[3])
                  ? ` Resposta correta: ${CorrectAnswers1[3]}`
                  : "\u00A0"}
              </p>

              <p>
                Resposta 5: {user.answerObj[4]}{" "}
                {checkAnswer(user.answerObj[4], CorrectAnswers1[4])}
                {!isAnswerCorrect(user.answerObj[4], CorrectAnswers1[4])
                  ? ` Resposta correta: ${CorrectAnswers1[4]}`
                  : "\u00A0"}
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3>Porcentagem de Acertos: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos1, CorrectAnswers1)}
                    text={`${Math.round(
                      calculatePercentage(acertos1, CorrectAnswers1)
                    ).toFixed(2)}%`}
                  />
                </div>
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3> Tempo por Questao: </h3>
              <p>Resposta 1: {Times1[0]} segundos</p>
              <br></br>
              <p>Resposta 2: {Times1[1]} segundos</p>
              <br></br>
              <p>Resposta 3: {Times1[2]} segundos</p>
              <br></br>
              <p>Resposta 4: {Times1[3]} segundos</p>
              <br></br>
              <p>Resposta 5: {Times1[4]} segundos</p>
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
                  Resposta 1: {user.answerObj[0]}{" "}
                  {checkAnswer(user.answerObj[0], CorrectAnswers2[0])}
                  {!isAnswerCorrect(user.answerObj[0], CorrectAnswers2[0])
                    ? ` Resposta correta: ${CorrectAnswers2[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.answerObj[1]}{" "}
                  {checkAnswer(user.answerObj[1], CorrectAnswers2[1])}
                  {!isAnswerCorrect(user.answerObj[1], CorrectAnswers2[1])
                    ? ` Resposta correta: ${CorrectAnswers2[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.answerObj[2]}{" "}
                  {checkAnswer(user.answerObj[2], CorrectAnswers2[2])}
                  {!isAnswerCorrect(user.answerObj[2], CorrectAnswers2[2])
                    ? ` Resposta correta: ${CorrectAnswers2[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.answerObj[3]}{" "}
                  {checkAnswer(user.answerObj[3], CorrectAnswers2[3])}
                  {!isAnswerCorrect(user.answerObj[3], CorrectAnswers2[3])
                    ? ` Resposta correta: ${CorrectAnswers2[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.answerObj[4]}{" "}
                  {checkAnswer(user.answerObj[4], CorrectAnswers2[4])}
                  {!isAnswerCorrect(user.answerObj[4], CorrectAnswers2[4])
                    ? ` Resposta correta: ${CorrectAnswers2[4]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 6: {user.answerObj[5]}{" "}
                  {checkAnswer(user.answerObj[5], CorrectAnswers2[5])}
                  {!isAnswerCorrect(user.answerObj[5], CorrectAnswers2[5])
                    ? ` Resposta correta: ${CorrectAnswers2[5]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 7: {user.answerObj[6]}{" "}
                  {checkAnswer(user.answerObj[6], CorrectAnswers2[6])}
                  {!isAnswerCorrect(user.answerObj[6], CorrectAnswers2[6])
                    ? ` Resposta correta: ${CorrectAnswers2[6]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 8: {user.answerObj[7]}{" "}
                  {checkAnswer(user.answerObj[7], CorrectAnswers2[7])}
                  {!isAnswerCorrect(user.answerObj[7], CorrectAnswers2[7])
                    ? ` Resposta correta: ${CorrectAnswers2[7]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 9: {user.answerObj[8]}{" "}
                  {checkAnswer(user.answerObj[8], CorrectAnswers2[8])}
                  {!isAnswerCorrect(user.answerObj[8], CorrectAnswers2[8])
                    ? ` Resposta correta: ${CorrectAnswers2[8]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Porcentagem de Acertos: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos2, CorrectAnswers2)}
                    text={`${Math.round(
                      calculatePercentage(acertos2, CorrectAnswers2)
                    ).toFixed(2)}%`}
                  />
                </div>
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3> Tempo por Questao: </h3>
              <p>Resposta 1: {Times2[0]} segundos</p>
              <br></br>
              <p>Resposta 2: {Times2[1]} segundos</p>
              <br></br>
              <p>Resposta 3: {Times2[2]} segundos</p>
              <br></br>
              <p>Resposta 4: {Times2[3]} segundos</p>
              <br></br>
              <p>Resposta 5: {Times2[4]} segundos</p>
              <br></br>
              <p>Resposta 6: {Times2[5]} segundos</p>
              <br></br>
              <p>Resposta 7: {Times2[6]} segundos</p>
              <br></br>
              <p>Resposta 8: {Times2[7]} segundos</p>
              <br></br>
              <p>Resposta 9: {Times2[8]} segundos</p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {userDataCollection3.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.answerObj[0]}{" "}
                  {checkAnswer(user.answerObj[0], CorrectAnswers3[0])}
                  {!isAnswerCorrect(user.answerObj[0], CorrectAnswers3[0])
                    ? ` Resposta correta: ${CorrectAnswers3[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.answerObj[1]}{" "}
                  {checkAnswer(user.answerObj[1], CorrectAnswers3[1])}
                  {!isAnswerCorrect(user.answerObj[1], CorrectAnswers3[1])
                    ? ` Resposta correta: ${CorrectAnswers3[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.answerObj[2]}{" "}
                  {checkAnswer(user.answerObj[2], CorrectAnswers3[2])}
                  {!isAnswerCorrect(user.answerObj[2], CorrectAnswers3[2])
                    ? ` Resposta correta: ${CorrectAnswers3[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.answerObj[3]}{" "}
                  {checkAnswer(user.answerObj[3], CorrectAnswers3[3])}
                  {!isAnswerCorrect(user.answerObj[3], CorrectAnswers3[3])
                    ? ` Resposta correta: ${CorrectAnswers3[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.answerObj[4]}{" "}
                  {checkAnswer(user.answerObj[4], CorrectAnswers3[4])}
                  {!isAnswerCorrect(user.answerObj[4], CorrectAnswers3[4])
                    ? ` Resposta correta: ${CorrectAnswers3[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Porcentagem de Acertos: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos3, CorrectAnswers3)}
                    text={`${Math.round(
                      calculatePercentage(acertos3, CorrectAnswers3)
                    ).toFixed(2)}%`}
                  />
                </div>
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3> Tempo por Questao: </h3>
              <p>Resposta 1: {Times3[0]} segundos</p>
              <br></br>
              <p>Resposta 2: {Times3[1]} segundos</p>
              <br></br>
              <p>Resposta 3: {Times3[2]} segundos</p>
              <br></br>
              <p>Resposta 4: {Times3[3]} segundos</p>
              <br></br>
              <p>Resposta 5: {Times3[4]} segundos</p>
              <br></br>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {userDataCollection4.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.answerObj[0]}{" "}
                  {checkAnswer(user.answerObj[0], CorrectAnswers4[0])}
                  {!isAnswerCorrect(user.answerObj[0], CorrectAnswers4[0])
                    ? ` Resposta correta: ${CorrectAnswers4[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.answerObj[1]}{" "}
                  {checkAnswer(user.answerObj[1], CorrectAnswers4[1])}
                  {!isAnswerCorrect(user.answerObj[1], CorrectAnswers4[1])
                    ? ` Resposta correta: ${CorrectAnswers4[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.answerObj[2]}{" "}
                  {checkAnswer(user.answerObj[2], CorrectAnswers4[2])}
                  {!isAnswerCorrect(user.answerObj[2], CorrectAnswers4[2])
                    ? ` Resposta correta: ${CorrectAnswers4[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.answerObj[3]}{" "}
                  {checkAnswer(user.answerObj[3], CorrectAnswers4[3])}
                  {!isAnswerCorrect(user.answerObj[3], CorrectAnswers4[3])
                    ? ` Resposta correta: ${CorrectAnswers4[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.answerObj[4]}{" "}
                  {checkAnswer(user.answerObj[4], CorrectAnswers4[4])}
                  {!isAnswerCorrect(user.answerObj[4], CorrectAnswers4[4])
                    ? ` Resposta correta: ${CorrectAnswers4[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Porcentagem de Acertos: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos4, CorrectAnswers4)}
                    text={`${Math.round(
                      calculatePercentage(acertos4, CorrectAnswers4)
                    ).toFixed(2)}%`}
                  />
                </div>
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3> Tempo por Questao: </h3>
              <p>Resposta 1: {Times4[0]} segundos</p>
              <br></br>
              <p>Resposta 2: {Times4[1]} segundos</p>
              <br></br>
              <p>Resposta 3: {Times4[2]} segundos</p>
              <br></br>
              <p>Resposta 4: {Times4[3]} segundos</p>
              <br></br>
              <p>Resposta 5: {Times4[4]} segundos</p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {userDataCollection5.map((user: User, index: number) => (
          <Grid container key={index} spacing={0}>
            <Grid item xs={4}>
              <div key={index}>
                <p>
                  Resposta 1: {user.answerObj[0]}{" "}
                  {checkAnswer(user.answerObj[0], CorrectAnswers5[0])}
                  {!isAnswerCorrect(user.answerObj[0], CorrectAnswers5[0])
                    ? ` Resposta correta: ${CorrectAnswers5[0]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 2: {user.answerObj[1]}{" "}
                  {checkAnswer(user.answerObj[1], CorrectAnswers5[1])}
                  {!isAnswerCorrect(user.answerObj[1], CorrectAnswers5[1])
                    ? ` Resposta correta: ${CorrectAnswers5[1]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 3: {user.answerObj[2]}{" "}
                  {checkAnswer(user.answerObj[2], CorrectAnswers5[2])}
                  {!isAnswerCorrect(user.answerObj[2], CorrectAnswers5[2])
                    ? ` Resposta correta: ${CorrectAnswers5[2]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 4: {user.answerObj[3]}{" "}
                  {checkAnswer(user.answerObj[3], CorrectAnswers5[3])}
                  {!isAnswerCorrect(user.answerObj[3], CorrectAnswers5[3])
                    ? ` Resposta correta: ${CorrectAnswers5[3]}`
                    : "\u00A0"}
                </p>
                <p>
                  Resposta 5: {user.answerObj[4]}{" "}
                  {checkAnswer(user.answerObj[4], CorrectAnswers5[4])}
                  {!isAnswerCorrect(user.answerObj[4], CorrectAnswers5[4])
                    ? ` Resposta correta: ${CorrectAnswers5[4]}`
                    : "\u00A0"}
                </p>
              </div>
            </Grid>
            <Grid item xs={4}>
              <h3>Porcentagem de Acertos: </h3> <br></br>
              <p>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={calculatePercentage(acertos5, CorrectAnswers5)}
                    text={`${Math.round(
                      calculatePercentage(acertos5, CorrectAnswers5)
                    ).toFixed(2)}%`}
                  />
                </div>
              </p>
            </Grid>
            <Grid item xs={4}>
              <h3> Tempo por Questao: </h3>
              <p>Resposta 1: {Times5[0]} segundos</p>
              <br></br>
              <p>Resposta 2: {Times5[1]} segundos</p>
              <br></br>
              <p>Resposta 3: {Times5[2]} segundos</p>
              <br></br>
              <p>Resposta 4: {Times5[3]} segundos</p>
              <br></br>
              <p>Resposta 5: {Times5[4]} segundos</p>
            </Grid>
          </Grid>
        ))}
      </TabPanel>
    </div>
  );
}
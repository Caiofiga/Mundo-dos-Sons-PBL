import React from "react";
import { Tab, Tabs, Box } from "@material-ui/core";
import { useEffect, useState, useContext } from "react";
import { getDocsByUserId } from "./firebase";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  nome: string;
  sobrenome: string;
  resposta1?: string;
  resposta2?: string;
  resposta3?: string;
  resposta4?: string;
  resposta5?: string;
  resposta6?: string;
  resposta7?: string;
  resposta8?: string;
  resposta9?: string;
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

export default function SimpleTabs({ userId }) {
  const [userDataCollection1, setUserDataCollection1] = useState<
    TabPanelProps[]
  >([]);
  const [userDataCollection2, setUserDataCollection2] = useState<
    TabPanelProps[]
  >([]);
  const [userDataCollection3, setUserDataCollection3] = useState<
    TabPanelProps[]
  >([]);
  const [userDataCollection4, setUserDataCollection4] = useState<
    TabPanelProps[]
  >([]);
  const [userDataCollection5, setUserDataCollection5] = useState<
    TabPanelProps[]
  >([]);
  const [userDataCollection6, setUserDataCollection6] = useState<
    TabPanelProps[]
  >([]);

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
    }

    fetchData();
  }, [userId]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  interface User {
    resposta1: string;
    resposta2: string;
    resposta3: string;
    resposta4: string;
    resposta5: string;
  }

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
      return <span className="correct"> Correct </span>;
    } else {
      return <span className="incorrect"> Incorrect </span>;
    }
  }

  return (
    <div>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Tab 1" />
        {/* More Tabs if needed */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <h2>Pergunta 1</h2>
        {userDataCollection1.map((user: User, index: number) => (
          <div key={index}>
            <p>
              Resposta 1: {user.resposta1}{" "}
              {checkAnswer(user.resposta1, CorrectAnswers1[0])}
            </p>
            <p>
              Resposta 2: {user.resposta2}{" "}
              {checkAnswer(user.resposta2, CorrectAnswers1[1])}
            </p>
            <p>
              Resposta 3: {user.resposta3}{" "}
              {checkAnswer(user.resposta3, CorrectAnswers1[2])}
            </p>
            <p>
              Resposta 4: {user.resposta4}{" "}
              {checkAnswer(user.resposta4, CorrectAnswers1[3])}
            </p>
            <p>
              Resposta 5: {user.resposta5}{" "}
              {checkAnswer(user.resposta5, CorrectAnswers1[4])}
            </p>
          </div>
        ))}
      </TabPanel>
      {/* More TabPanels if needed */}
    </div>
  );
}

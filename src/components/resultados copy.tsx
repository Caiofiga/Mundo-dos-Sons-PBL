import React, { useEffect, useState } from "react";
import { getDocsByUserId } from "./firebase";
import { db } from "./firebase"; // Assuming your Firestore db instance is exported from 'firebase.tsx'
import "../css/resultados.css";

interface UserData {
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
  // Add more fields as necessary
}

function UserResults({ userId }) {
  const [userDataCollection1, setUserDataCollection1] = useState<UserData[]>(
    []
  );
  const [userDataCollection2, setUserDataCollection2] = useState<UserData[]>(
    []
  );
  const [userDataCollection3, setUserDataCollection3] = useState<UserData[]>(
    []
  );
  const [userDataCollection4, setUserDataCollection4] = useState<UserData[]>(
    []
  );
  const [userDataCollection5, setUserDataCollection5] = useState<UserData[]>(
    []
  );
  const [userDataCollection6, setUserDataCollection6] = useState<UserData[]>(
    []
  );
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

      // set more state variables if you have fetched from more collections
    }

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
      return <span className="correct"> Correct </span>;
    } else {
      return <span className="incorrect"> Incorrect </span>;
    }
  }

  return (
    <div>
      <h1> Dados do usuario: </h1>
      {userDataCollection6.map((user, index) => (
        <div key={index}>
          <p>Nome: {user.nome} </p>
          <p>Sobrenome: {user.sobrenome} </p>
        </div>
      ))}

      <h2>Pergunta 1</h2>
      {userDataCollection1.map((user, index) => (
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

      <h2>Data from Collection 2</h2>
      {userDataCollection2.map((user, index) => (
        <div key={index}>
          <p>
            Resposta 1: {user.resposta1}{" "}
            {checkAnswer(user.resposta1, CorrectAnswers2[0])}
            {CorrectAnswers2[0]}
          </p>
          <p>
            Resposta 2: {user.resposta2}{" "}
            {checkAnswer(user.resposta2, CorrectAnswers2[1])}
          </p>
          <p>
            Resposta 3: {user.resposta3}{" "}
            {checkAnswer(user.resposta3, CorrectAnswers2[2])}
          </p>
          <p>
            Resposta 4: {user.resposta4}{" "}
            {checkAnswer(user.resposta4, CorrectAnswers2[3])}
          </p>
          <p>
            Resposta 5: {user.resposta5}{" "}
            {checkAnswer(user.resposta5, CorrectAnswers2[4])}
          </p>
          <p>
            Resposta 6: {user.resposta6}{" "}
            {checkAnswer(user.resposta6, CorrectAnswers2[5])}
          </p>
          <p>
            Resposta 7: {user.resposta7}{" "}
            {checkAnswer(user.resposta7, CorrectAnswers2[6])}
          </p>
          <p>
            Resposta 8: {user.resposta8}{" "}
            {checkAnswer(user.resposta8, CorrectAnswers2[7])}
          </p>
          <p>
            Resposta 9: {user.resposta9}{" "}
            {checkAnswer(user.resposta9, CorrectAnswers2[8])}
          </p>
          {/* Add more fields as necessary */}
        </div>
      ))}
      <h2>Data from Collection 3</h2>
      {userDataCollection3.map((user, index) => (
        <div key={index}>
          <p>
            Resposta 1: {user.resposta1}{" "}
            {checkAnswer(user.resposta1, CorrectAnswers3[0])}
            {CorrectAnswers3[0]}
          </p>
          <p>
            Resposta 2: {user.resposta2}{" "}
            {checkAnswer(user.resposta2, CorrectAnswers3[1])}
          </p>
          <p>
            Resposta 3: {user.resposta3}{" "}
            {checkAnswer(user.resposta3, CorrectAnswers3[2])}
          </p>
          <p>
            Resposta 4: {user.resposta4}{" "}
            {checkAnswer(user.resposta4, CorrectAnswers3[3])}
          </p>
          <p>
            Resposta 5: {user.resposta5}{" "}
            {checkAnswer(user.resposta5, CorrectAnswers3[4])}
          </p>
        </div>
      ))}
      <h2>Data from Collection 4</h2>
      {userDataCollection4.map((user, index) => (
        <div key={index}>
          <p>
            Resposta 1: {user.resposta1}{" "}
            {checkAnswer(user.resposta1, CorrectAnswers4[0])}
          </p>
          <p>
            Resposta 2: {user.resposta2}{" "}
            {checkAnswer(user.resposta2, CorrectAnswers4[1])}
          </p>
          <p>
            Resposta 3: {user.resposta3}{" "}
            {checkAnswer(user.resposta3, CorrectAnswers4[2])}
          </p>
          <p>
            Resposta 4: {user.resposta4}{" "}
            {checkAnswer(user.resposta4, CorrectAnswers4[3])}
          </p>
          <p>
            Resposta 5: {user.resposta5}{" "}
            {checkAnswer(user.resposta5, CorrectAnswers4[4])}
          </p>
        </div>
      ))}
      <h2>Data from Collection 5</h2>
      {userDataCollection5.map((user, index) => (
        <div key={index}>
          <p>
            Resposta 1: {user.resposta1}{" "}
            {checkAnswer(user.resposta1, CorrectAnswers5[0])}
          </p>
          <p>
            Resposta 2: {user.resposta2}{" "}
            {checkAnswer(user.resposta2, CorrectAnswers5[1])}
          </p>
          <p>
            Resposta 3: {user.resposta3}{" "}
            {checkAnswer(user.resposta3, CorrectAnswers5[2])}
          </p>
          <p>
            Resposta 4: {user.resposta4}{" "}
            {checkAnswer(user.resposta4, CorrectAnswers5[3])}
          </p>
          <p>
            Resposta 5: {user.resposta5}{" "}
            {checkAnswer(user.resposta5, CorrectAnswers5[4])}
          </p>
        </div>
      ))}
      {/* Render more collections if you have fetched more data */}
    </div>
  );
}

export default UserResults;

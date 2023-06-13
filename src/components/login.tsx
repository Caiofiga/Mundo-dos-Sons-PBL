import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import "../css/login.css";
import { Md5 } from "ts-md5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import firebaseConfig from "./firebaseconfig";

const titulo = "/img/titulo.png";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SignUp: React.FC = () => {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [atividades, setAtividades] = useState([""]); // Array of strings
  const [idade, setIdade] = useState("");
  const { setUserId } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state variable

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return; // Disable submit if already submitting
    setIsSubmitting(true); // Set submitting state to true
    try {
      const nameHash = Md5.hashStr(nome + sobrenome + idade);
      const hashnum = nameHash.replace(/\D/g, "");
      const userId = hashnum.slice(0, 8);
      await addDoc(collection(db, "users"), {
        atividades,
        userId,
        nome,
        sobrenome,
        idade,
      });
      setUserId(userId); // Set the userId in the context
      navigate("/Home"); // Redirect to /other

    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  return (
    <div className="container">
      <img src={titulo} alt="logo" />
      <div className="row justify-content-center">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nome"
                placeholder="Coloque o nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                className="form-control"
                required
              />
              <br />
              <input
                type="text"
                name="sobrenome"
                placeholder="Coloque o sobrenome"
                value={sobrenome}
                onChange={(event) => setSobrenome(event.target.value)}
                className="form-control"
                required
              />
              <br />
              <input
                type="number"
                min={0}
                name="idade"
                placeholder="Coloque a idade"
                value={idade}
                onChange={(event) => setIdade(event.target.value)}
                className="form-control"
                required
              />
              <br />
              <input
                type="text"
                name="atividades"
                placeholder="Coloque as atividades"
                value={atividades.join(", ")}
                onChange={(event) =>
                  setAtividades(event.target.value.split(", "))
                }
                className="form-control"
              />
            </div>
            <button
              className="btn btn-outline-primary"
              type="submit"
              disabled={isSubmitting}
            >
              Cadastrar
            </button>{" "}
            {/* Disable button if submitting */}
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;

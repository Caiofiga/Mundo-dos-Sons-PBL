import React, { useState, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import CheckboxOption from "./CheckboxOption";
import "../css/login.css";
import { Md5 } from "ts-md5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const firebaseConfig = {
  apiKey: "AIzaSyBxmVORAk4TDkQ02b33UL4h2ilsbyYcEw4",
  authDomain: "pbl-app-b3962.firebaseapp.com",
  projectId: "pbl-app-b3962",
  storageBucket: "pbl-app-b3962.appspot.com",
  messagingSenderId: "1070603645378",
  appId: "1:1070603645378:web:24a7cdc14cf31036f7265b",
  measurementId: "G-0CBT4CJ3DR",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface CheckboxState {
  [key: string]: boolean;
}

interface ToggleableSectionProps {
  title: string;
  children: React.ReactNode;
}

const ToggleableSection: React.FC<ToggleableSectionProps> = ({
  title,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <h2 onClick={() => setIsVisible(!isVisible)}>{title}</h2>
      {isVisible && children}
    </div>
  );
};

const SignUp: React.FC = () => {
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({});
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState("");
  const { setUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxState({
      ...checkboxState,
      [event.target.value]: event.target.checked,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const nameHash = Md5.hashStr(nome + sobrenome + idade);
      const hashnum = nameHash.replace(/\D/g, "");
      const userId = hashnum.slice(0, 8);
      await addDoc(collection(db, "users"), {
        ...checkboxState,
        userId,
        nome,
        sobrenome,
        idade,
      });
      setUserId(userId); // Set the userId in the context
      navigate("/Drag"); // Redirect to /other

      alert("Data has been submitted");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="coloque o nome"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />
      <br />
      <input
        type="text"
        name="sobrenome"
        placeholder="coloque o sobrenome"
        value={sobrenome}
        onChange={(event) => setSobrenome(event.target.value)}
      />
      <br />
      <input
        type="number"
        name="idade"
        placeholder="coloque a idade"
        value={idade}
        onChange={(event) => setIdade(event.target.value)}
      />
      <br />
      <ToggleableSection title="Atividades">
        <ToggleableSection title="Fruit">
          <CheckboxOption title="Apple" onChange={handleCheckboxChange} />
          <br />
          <CheckboxOption title="Banana" onChange={handleCheckboxChange} />
          <br />
          <CheckboxOption title="Orange" onChange={handleCheckboxChange} />
          <br />
        </ToggleableSection>

        <ToggleableSection title="Drink">
          <ToggleableSection title="Soft">
            <CheckboxOption title="Cola" onChange={handleCheckboxChange} />
            <br />
            <CheckboxOption title="Soda" onChange={handleCheckboxChange} />
            <br />
            <CheckboxOption title="Lemonade" onChange={handleCheckboxChange} />
            <br />
          </ToggleableSection>

          <ToggleableSection title="Hard">
            <CheckboxOption title="Bear" onChange={handleCheckboxChange} />
            <br />
            <CheckboxOption title="Whisky" onChange={handleCheckboxChange} />
            <br />
            <CheckboxOption title="Vodka" onChange={handleCheckboxChange} />
            <br />
            <CheckboxOption title="Gin" onChange={handleCheckboxChange} />
            <br />
          </ToggleableSection>
        </ToggleableSection>
      </ToggleableSection>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignUp;

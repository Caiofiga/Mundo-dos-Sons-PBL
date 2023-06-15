import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import "../css/login.css";
import { Md5 } from "ts-md5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import firebaseConfig from "./firebaseconfig";
import { getUser, getAllUsers, DeleteData, GetUserId, DelDocByID, GetCustomUId } from "./firebase";


const videosrc = "./video/video.mp4"
enum PageStates {
  VIDEO,
  CHECK,
  LOGIN,
  LOOKUP,
  RESULTS,
  DENIED
}

interface VideoProps {
  OnAcceptClick: () => void;
  OnDenyClick: () => void;
}
interface CheckProps {
  OnNewClick: () => void;
  OnOldClick: () => void;
}
interface LookupProps {
  OnLookupClick: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  OnListAllClick: () => Promise<void>;
  nome: string;
  setNome: React.Dispatch<React.SetStateAction<string>>;
  sobrenome: string;
  setSobrenome: React.Dispatch<React.SetStateAction<string>>;
  idade: string;
  setIdade: React.Dispatch<React.SetStateAction<string>>;
}

interface ResultsProps {
  users: any[];
  onSelect: (user: any) => void;
  onDelete: (user: any) => void;
}

const ResultsPage: React.FC<ResultsProps> = ({ users, onSelect, onDelete }) => {
  return (

    <div>
      {users.map((user, index) => (
        <div key={index}>
          <p>Nome: {user.nome}, Sobrenome: {user.sobrenome}, Idade: {user.idade} 
          <button onClick={() => onSelect(user)} style={{marginLeft: "10px"}} className="btn btn-outline-primary">
            Selecionar
          </button>
          <button onClick={() => onDelete(user)} style={{marginLeft: "10px"}} className="btn btn-outline-danger">
          Remover
          </button>
          </p>
          {index !== users.length - 1 && <hr />}  {/* Don't render on the last user */}
        </div>
      ))}
    </div>
  )
}



const VideoPage: React.FC<VideoProps> = ({ OnAcceptClick, OnDenyClick }) => {
  return (
  <div className="app-container">
  <video className="video" width="504" height="440" controls>
    <source src={videosrc} type="video/mp4" />
    </video>
    <div className="button-container"> 
  <button className="buttonsme" onClick={OnAcceptClick}>Aceitar</button>
  <button className="buttonsme" onClick={OnDenyClick}>Recusar</button>
  </div>
  </div>
  )
}
const CheckPage: React.FC<CheckProps> = ({ OnNewClick, OnOldClick }) => {
  return (
  <div>
    <span>  Ja jogou? </span>
  <button onClick={OnNewClick}>Novo usuario</button>
  <button onClick={OnOldClick}>Usuario antigo</button>
  </div>
  )
}
const LookupPage: React.FC<LookupProps> = ({ OnLookupClick, OnListAllClick, nome, setNome, sobrenome, setSobrenome, idade, setIdade }) => {
  return (
  <div>
<form onSubmit={OnLookupClick}>
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
        type="number" min={0}
        name="idade"
        placeholder="Coloque a idade"
        value={idade}
        onChange={(event) => setIdade(event.target.value)}
        className="form-control"
        required
      />
      <br />
      </div>
      <button type="submit" className="btn btn-primary" >
        Pesquisar 
        </button>
</form>
<button onClick={OnListAllClick} className="btn btn-secondary">
        List All 
      </button>
  </div>
  )
}




const titulo = "./src/img/titulo.png";


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
  const [PageState, setPageState] = useState(PageStates.VIDEO)
  const [results, setResults] = useState<any[]>([]); // to hold results from the lookup
  
  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    // prevent form from submitting normally
    event.preventDefault();
  
    try {
      const users = await getUser(nome, sobrenome); // call getUser with nome and sobrenome
      setResults(users); // save the result in state
      setPageState(PageStates.RESULTS); // go to results page after fetching
      console.log(nome)
      console.log(sobrenome)
      console.log(results)
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  const handleListAll = async () => {
    try {
      const users = await getAllUsers(); // implement this function to fetch all users from Firebase
      setResults(users);
      setPageState(PageStates.RESULTS);
    } catch (e) {
      console.error("Error fetching all users: ", e);
    }
  };


  const ChangeData = async (nome: string, sobrenome: string, idade: string) => {
    try {
      
      const id = await GetUserId(nome, sobrenome, idade);
      console.log(id)
      await DelDocByID(id);
      console.log("user ", nome, sobrenome, id, "is deleted!");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }
    

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

      alert("Data has been submitted");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const handleSelect = (nome: string, sobrenome: string, idade: string) => {
  const UserId = await GetCustomUId(nome, sobrenome, idade)
  setUserId(UserId)
  navigate("/Resultados")
  };

  return (
  <div key={PageState}>

{PageState === PageStates.RESULTS && (
  <ResultsPage 
  users={results} 
  onSelect={(user) =>handleSelect(user.nome, user.sobrenome, user.idade)} 
  onDelete={(user) => ChangeData(user.nome, user.sobrenome, user.idade)}
/>
)}

    {PageState === PageStates.CHECK && (
      <CheckPage
      OnNewClick={() => setPageState(PageStates.LOGIN)} OnOldClick={() => setPageState(PageStates.LOOKUP)} />

    )}
   {PageState === PageStates.LOOKUP &&(
     <LookupPage 
     OnLookupClick={handleLookup}
     OnListAllClick={handleListAll}
     nome={nome}
     setNome={setNome}
     sobrenome={sobrenome}
     setSobrenome={setSobrenome}
     idade={idade}
     setIdade={setIdade}
   />

)}

{PageState === PageStates.VIDEO &&(
  <VideoPage OnAcceptClick={() => setPageState(PageStates.CHECK)} OnDenyClick={() => setPageState(PageStates.DENIED)} />
)}


    {PageState === PageStates.LOGIN && (
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
        type="number" min={0}
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
        onChange={(event) => setAtividades(event.target.value.split(", "))}
        className="form-control"
      />
      </div>
      <button className="btn btn-outline-primary" type="submit" disabled={isSubmitting}>Cadastrar</button> {/* Disable button if submitting */}
    </form>
    </div>
    </div>
    </div>
    )
}

    </div>
  );
};
export default SignUp;
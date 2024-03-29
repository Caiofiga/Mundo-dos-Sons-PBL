import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import "../css/login.css";
import { Md5 } from "ts-md5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import firebaseConfig from "./firebaseconfig";
import { getUser, getAllUsers, GetUserId, DelDocByID, GetCustomUId } from "./firebase";
import AlertComponent from "./AlertComponent";

const titulo = "./img/titulo.png";

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
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultsPage: React.FC<ResultsProps> = ({ users, onSelect, onDelete, show, setShow }) => {
  const [alertText, setAlertText] = useState(''); // for managing alert text

  const handleAlertClose = () => {
    setShow(false);
  };

  // Delete handler that sets the alert text
  const handleDelete = (user: any) => {
    onDelete(user);
    setAlertText(`Usuário ${user.nome} ${user.sobrenome} removido com sucesso!`);
    setShow(true); // display the alert after setting the text
  }


  return (
    <div>
      {users.map((user, index) => {
        return (
          <div key={index}>
            <p>Nome: {user.nome}, Sobrenome: {user.sobrenome}, Idade: {user.idade} 
            <button onClick={() => onSelect(user)} style={{marginLeft: "10px"}} className="btn btn-outline-primary">
              Selecionar
            </button>
            <button onClick={() => handleDelete(user)} style={{marginLeft: "10px"}} className="btn btn-outline-danger">
              Remover
            </button>
            </p>
            {index !== users.length - 1 && <hr />}  {/* Don't render on the last user */}
          </div>
        );
      })}
      <div className="alert-bottom-right">
        <AlertComponent text={alertText} show={show} onClose={handleAlertClose} />
      </div>
    </div>
  )
}




const VideoPage: React.FC<VideoProps> = ({ OnAcceptClick, OnDenyClick }) => {
  return (
  <div className="app-container">
  <iframe width="960" height="540" src="https://www.youtube.com/embed/FmlMAN68u5Y" title="Join Our Team" 
   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  allowFullScreen className="video">
  </iframe>
    <div className="button-container"> 
  <button className="buttonsme btn btn-outline-success" onClick={OnAcceptClick}>Aceitar 👍 </button>
  <button className="buttonsme btn btn-outline-danger" onClick={OnDenyClick}>Recusar 👎</button>
  </div>
  </div>
  )
}
const CheckPage: React.FC<CheckProps> = ({ OnNewClick, OnOldClick }) => {
  return (
  <div className="app-container">
    <span> <img src={titulo}></img></span>
    <br></br>
    <br></br>
    <h2>  Já jogou? </h2>
    <div className="button-container">
  <button className="buttonsme2 btn btn-outline-warning"  onClick={OnNewClick}>Novo usuário</button>
  <button className="buttonsme2 btn btn-outline-primary"  onClick={OnOldClick}>Usuário antigo</button>
  </div>
  </div>
  )
}
const LookupPage: React.FC<LookupProps> = ({ OnLookupClick, OnListAllClick, nome, setNome, sobrenome, setSobrenome, idade, setIdade }) => {

  return (
  <div className="app-container">
    <h1> Pesquisar Usuários </h1>
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
      <div className="button-container">
      <button type="submit" className=" buttonsme3 btn btn-primary">
        Pesquisar 
      </button>
      <button onClick={OnListAllClick} className="buttonsme3 btn btn-secondary">
        Listar todos 
      </button>
    </div>
  </form>
</div>
  )
} 

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
  const [PageState, setPageState] = useState(PageStates.VIDEO); // Add state variable
  const [results, setResults] = useState<any[]>([]); // to hold results from the lookup
  const [show, setShow] = useState(false);  // define 'show' and 'setShow' inside the component

  
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
      if (id) {
        await DelDocByID(id);
      }
      setShow(true); // use setShow to update the state when you want to show the alert
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
      navigate("/Sons"); // Redirect to /other

    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const handleSelect = (nome: string, sobrenome: string, idade: string) => {
    GetCustomUId(nome, sobrenome, idade).then(UserId => {
      setUserId(UserId);
      console.log("UserId: ", UserId);
      navigate("/Resultados");
    });
  };

  return (
  <div key={PageState}>

{PageState === PageStates.RESULTS && (
   <ResultsPage 
   users={results} 
   onSelect={(user) =>handleSelect(user.nome, user.sobrenome, user.idade)} 
   onDelete={(user) => ChangeData(user.nome, user.sobrenome, user.idade)}
   show={show}
   setShow={setShow}
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
  <VideoPage OnAcceptClick={() => setPageState(PageStates.LOGIN)} OnDenyClick={() => setPageState(PageStates.DENIED)} />
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
{PageState === PageStates.DENIED &&(
  <div className="app-container">
  <h1>OK, entendido</h1>
  </div>
)}
    </div>
  );
};
export default SignUp;
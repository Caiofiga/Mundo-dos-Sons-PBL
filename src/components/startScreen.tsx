import React from "react";
import { useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.css';


const titulo = "img/titulo.png";

export const Home: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <div className="container">
            <div className="row justify-content-center">
        <h1><img src={titulo} /></h1>
        <button className="btn btn-outline-primary" onClick={() => navigate("/Drag")}>Jogar!</button>
        </div>
        </div>
        
    );
    }

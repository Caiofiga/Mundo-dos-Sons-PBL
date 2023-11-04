import React from "react";
import ReactDOM from "react-dom";
import "./css/silaba.css"; // Assuming you have your styles in index.css
import "./css/drag.css"; // Assuming you have your styles in index.css
import Routers,  { Navbar } from "./components/Route";


ReactDOM.render(
  <React.StrictMode>
    <Routers />
  </React.StrictMode>,
  document.getElementById("root")
);

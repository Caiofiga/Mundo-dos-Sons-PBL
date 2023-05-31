import React from "react";
import MyComponent from "./components/silabas"; // ensure this path points to the file that contains your ListWithLinks component
import { LevelProvider } from "./components/ImproveLevel";

function App() {
  return (
    <div className="App">
      <h1>My React App</h1>
      <LevelProvider>
        {" "}
        <MyComponent />
      </LevelProvider>
    </div>
  );
}

export default App;

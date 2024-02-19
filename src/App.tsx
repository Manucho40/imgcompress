import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ImagesSelected from "./components/ImagesSelected";
import { Alert } from "antd";
export type ErrorType = {
  message: string,
  description: string,
  type: any,
}
function App() {
  const [errorAlert, setErrorAlert] = useState<ErrorType | null>(null);
  return (
    <div className="App">
      { errorAlert && (<Alert
          message={errorAlert?.message}
          description={errorAlert?.description}
          type={errorAlert?.type}
          showIcon
          closable
          onClose={() => setErrorAlert(null)}
      />)}
      <h1>Compresseur d'image</h1>
      <ImagesSelected  setErrorAlert={setErrorAlert}/>
    </div>
  );
}

export default App;

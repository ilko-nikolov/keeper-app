// components/App.jsx

import React, { useState } from "react";
import Notes from "./components/Notes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";

function App() {
  const [data, setData] = useState({});

  React.useEffect(() => {
    fetch("/user", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data)
      })
      .catch((err) => console.log(err));
  }, []);

  function logout() {
    fetch("/logout", {
      method: "GET",
    })  .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data)
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <Header user={data.username} onLogout={logout}/>

      {data.authenticated ? (<Notes />) : data.authenticated === false && (<Login onLogin={setData} />) }

      <Footer />
    </div>
  );
}

export default App;

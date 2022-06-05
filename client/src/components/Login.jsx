// components/Login.jsx

import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  function handleLoginButtonClick(event) {
    event.preventDefault();
    const route = event.target.name === "login" ? "/login" : "/register";
    fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.error ? setError(data.error) : onLogin(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form className="login-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        {errorMessage && <div className="error"> {errorMessage} </div>}
        <button
          className="login-button"
          type="submit"
          name="login"
          onClick={handleLoginButtonClick}
        >
          Login
        </button>{" "}
        &nbsp;
        <button
          className="register-button"
          type="submit"
          name="register"
          onClick={handleLoginButtonClick}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;

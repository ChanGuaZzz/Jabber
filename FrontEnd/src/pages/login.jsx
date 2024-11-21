import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/input.css";
import "animate.css";
import logo from "../img/logo.png";
import letra from "../img/logo_letra.png";

function Login() {
  const [currentWindow, setCurrentWindow] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondpassword, setsecondpassword] = useState("");

  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [Errorpassword, setErrorpassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que el formulario haga un submit por defecto

    axios
      .post("https://jabberweb.onrender.com/api/api/login", { username, password }, { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);
        if (response.status === 200) {
          // Redireccionar al usuario después de un inicio de sesión exitoso
          window.location.href = "/jabber";
        }
      })
      .catch((error) => {
        if (message === "Incorrect username or password.") {
          setAnimation("animate__animated animate__headShake");
          setTimeout(() => {
            setAnimation("");
          }, 500);
        } else {
          setMessage("Incorrect username or password.");
        }
      });
  };

  useEffect(() => {
    if (password != "" && secondpassword != "") {
      if (password == secondpassword) {
        setErrorpassword(false);
      } else {
        setErrorpassword(true);
      }
    }
  }, [password, secondpassword]);

  const handleRegister = (e) => {
    e.preventDefault(); // Evita que el formulario haga un submit por defecto

    axios
      .post("https://jabberweb.onrender.com/api/api/register", { username, email, password })
      .then((response) => {
        setMessage(response.data.message);
        // Puedes manejar el cambio de ventana aquí si es necesario
        setCurrentWindow("login");
      })
      .catch((error) => {
        setMessage("User already exists or invalid input.");
      });
  };

  return (
    <div className="background-login w-full h-full flex justify-center items-center  p-0">
      <div className="h-full w-full  flex items-center flex-col text-center justify-center">
        <div className={`  ${currentWindow != "login" ? "h-[30%]":"h-[40%]"}  flex items-center flex-col  justify-center`}>
          <img src={logo} alt="" />
          <img src={letra} alt="" />
        </div>
        <div className="h-[40%] flex flex-col w-4/5 sm:w-2/5 xl:w-1/5 lg:w-2/5">
          {currentWindow === "login" ? (
            <>
              <form className="flex flex-col" onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="buttonG rounded-xl button p-3" type="submit">
                  Sign in
                </button>
              </form>
              <p className="text-white">
                I don't have an account{" "}
                <a
                  className="font-medium text-orange-500"
                  onClick={() => {
                    setCurrentWindow("register");
                  }}
                >
                  Sign Up
                </a>
              </p>
            </>
          ) : (
            <>
              <form className="flex flex-col" onSubmit={handleRegister}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <input
                className="mb-0"
                  type="password"
                  placeholder="repeat password"
                  onChange={(e) => {
                    setsecondpassword(e.target.value);
                  }}
                  required
                />
                {Errorpassword ? (
                  <>
                    <h1 className="text-red-500 text-xs">check password</h1>
                    <button disabled className=" opacity-80 pointer-events-none buttonG rounded-xl button p-3" type="submit">
                      Register
                    </button>
                  </>
                ) : (
                  <button className="buttonG rounded-xl button p-3 mt-4" type="submit">
                    Register
                  </button>
                )}
              </form>
              <p className="text-white">
              I already have an account {" "}
                <a
                  className="font-medium text-orange-500"
                  onClick={() => {
                    setCurrentWindow("login");
                  }}
                >
                  Sign Up
                </a>
              </p>
            </>
          )}
          {message && <p className={`messages ${animation}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;

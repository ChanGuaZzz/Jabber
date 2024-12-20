import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/input.css";
import "animate.css";
import logo from "../img/logo.png";
import letra from "../img/logo_letra.png";
import Loading from "../components/loading";

function Login() {
  const [currentWindow, setCurrentWindow] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondpassword, setsecondpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [Errorpassword, setErrorpassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que el formulario haga un submit por defecto
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);
        setLoading(false);
        if (response.status === 200) {
          // Redireccionar al usuario después de un inicio de sesión exitoso
          window.location.href = "/jabber";
        }
      })
      .catch((error) => {
        setMessage("Login failed. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
      if (password !== secondpassword) {
        setErrorpassword(true);
        return;
      }else{
      setErrorpassword(false);}
  }, [secondpassword, password]);

  const handleRegister = (e) => {
    e.preventDefault(); // Evita que el formulario haga un submit por defecto
    
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/register`, { username, email, password }, { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);
        setLoading(false);
        if (response.status === 201) {
          // Redireccionar al usuario después de un registro exitoso
          window.location.href = "/jabber";
        }
      })
      .catch((error) => {
        setMessage(error.response.data.JabberMessages);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="background-login w-full min-h-screen flex justify-center items-center p-0">
        <div className="size-full flex items-center flex-col text-center justify-center">
          <div className={` ${currentWindow !== "login" ? "h-[30%]" : "h-[40%]"} flex items-center flex-col justify-center`}>
            <img src={logo} alt="Logo" />
            <img src={letra} alt="Letra" />
          </div>
          <div className="h-[40%] flex flex-col  items-center w-4/5 sm:w-2/5 xl:w-1/5 lg:w-2/5">
            {currentWindow === "login" ? (
              <>
                <form className="flex flex-col w-[90%]" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Username"
                    minLength={4}
                    maxLength={10}
                    value={username}
                    className="mb-5 p-2"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="mb-5 p-2"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button className="buttonG rounded-xl button p-3 my-3" type="submit">
                    Sign in
                  </button>
                </form>
                <p className="text-white">
                  I don't have an account{" "}
                  <a
                    className="font-medium text-orange-500 cursor-pointer"
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
                <form className="flex flex-col w-[90%]" onSubmit={handleRegister}>
                  <input
                    type="text"
                    placeholder="Username"
                    minLength={4}
                    maxLength={10}
                    className="my-5 p-2"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="mb-5 p-2"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="mb-5 p-2"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    className={`mb-0 p-2 ${Errorpassword && "text-red-600"} `}
                    type="password"
                    placeholder="Repeat password"
                    onChange={(e) => {
                      setsecondpassword(e.target.value);
                    }}
                    required
                  />
                  {Errorpassword ? (
                    <>
                      <button disabled className="opacity-80 pointer-events-none my-3 buttonG rounded-xl button p-3" type="submit">
                        Register
                      </button>
                    </>
                  ) : (
                    <button className="buttonG rounded-xl button p-3 my-3" type="submit">
                      Register
                    </button>
                  )}
                </form>
                <p className="text-white">
                  I already have an account{" "}
                  <a
                    className="font-medium text-orange-500 cursor-pointer"
                    onClick={() => {
                      setCurrentWindow("login");
                    }}
                  >
                    Sign In
                  </a>
                </p>
              </>
            )}
            {message && <p className={`messages ${animation}`}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
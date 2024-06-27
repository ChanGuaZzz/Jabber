import React, { useState } from "react";
import axios from "axios";
import '../styles/input.css'
import 'animate.css';
import logo from '../img/logo.png';
import letra from '../img/logo_letra.png';

function Login() {
    const [currentWindow, setCurrentWindow] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [animation, setAnimation] = useState("");

    const handleLogin = (e) => {
        e.preventDefault(); // Evita que el formulario haga un submit por defecto

        axios.post('http://localhost:5000/api/login', { username, password }, { withCredentials: true })
            .then(response => {
                setMessage(response.data.message);
                if (response.status === 200) { 
                    // Redireccionar al usuario después de un inicio de sesión exitoso
                    window.location.href = "/jabber";
                }
            })
            .catch(error => {
                if (message === 'Incorrect username or password.'){
                    
                    setAnimation('animate__animated animate__headShake');
                    setTimeout(()=>{
                      setAnimation("")
                    },500);
                  
                }else{
                    setMessage('Incorrect username or password.');
                }
                

            });
    };

    const handleRegister = (e) => {
        e.preventDefault(); // Evita que el formulario haga un submit por defecto

        axios.post('http://localhost:5000/api/register', { username, email, password })
            .then(response => {
                setMessage(response.data.message);
                // Puedes manejar el cambio de ventana aquí si es necesario
                setCurrentWindow('login');
            })
            .catch(error => {
                setMessage('User already exists or invalid input.');
            });
    };

    return (
        <div className="background-login w-full h-full flex justify-center items-center  p-0">
           
            <div className="h-full w-full  flex items-center flex-col  justify-center" >
                    <div className="h-2/3 flex items-center flex-col  justify-center">
                     <img  src={logo} alt="" />
                     <img  src={letra} alt="" />
                     </div>
                {currentWindow === "login" ?
                    <div  className="h-3/5  flex flex-col w-4/5 sm:w-3/5 xl:w-1/5 lg:w-2/5">
                        <h2 className="text-center">Log in</h2>
                        <form className="flex flex-col" onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="buttonG" type="submit">Log In</button>
                        </form>
                       <p className="text-white">I don't have an account <a className="font-medium text-orange-500" onClick={() => { setCurrentWindow('register') }}>Sign Up</a></p> 
                    </div>
                    :
                    <div className="h-3/5  flex flex-col w-4/5 sm:w-3/5 xl:w-1/5 lg:w-2/5" >
                        <h2 className="text-center">Register</h2>
                        <form className="flex flex-col" onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="buttonG" type="submit">Register</button>
                        </form>
                        <p className="text-white">I don't have an account <a className="font-medium text-orange-500" onClick={() => { setCurrentWindow('login') }}>Sign Up</a></p> 
                    </div>
                }
                {message && <p className={`messages ${animation}`}>{message}</p>}
            </div>
        </div>
    );
}

export default Login;

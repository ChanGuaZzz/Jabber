import React, { useState } from "react";
import axios from "axios";
import '../styles/input.css'

function Login() {
    const [currentWindow, setCurrentWindow] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = (e) => {
        e.preventDefault(); // Evita que el formulario haga un submit por defecto

        axios.post('http://localhost:5000/api/login', { username, password })
            .then(response => {
                setMessage(response.data.message);
                if (response.status === 200) {
                    // Redireccionar al usuario después de un inicio de sesión exitoso
                    window.location.href = "/jabber";
                }
            })
            .catch(error => {
                setMessage('Incorrect username or password.');
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
        <div className="background-login w-full h-full flex justify-center items-center">
            <div  >
                <img src="" alt="" />
                {currentWindow === "login" ?
                    <div className="flex flex-col">
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
                            <button type="submit">Enter</button>
                        </form>
                        <button onClick={() => { setCurrentWindow('register') }}>I don't have an account</button>
                    </div>
                    :
                    <div className="flex flex-col" >
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
                            <button type="submit">Register</button>
                        </form>
                        <button onClick={() => { setCurrentWindow('login') }}>I have an account</button>
                    </div>
                }
                {message && <p className="messages">{message}</p>}
            </div>
        </div>
    );
}

export default Login;

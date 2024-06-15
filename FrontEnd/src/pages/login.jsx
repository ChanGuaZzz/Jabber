import React, { useState } from "react";
import axios from "axios";
import '../styles/input.css'

function Login() {
    const [window, setWindow] = useState("login");
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
                setMessage('Error: Incorrect username or password.');
            });
    };

    const handleRegister = (e) => {
        e.preventDefault(); // Evita que el formulario haga un submit por defecto

        axios.post('http://localhost:5000/api/register', { username, email, password })
            .then(response => {
                setMessage(response.data.message);
                // Puedes manejar el cambio de ventana aquí si es necesario
                setWindow('login');
            })
            .catch(error => {
                setMessage('Error: User already exists or invalid input.');
            });
    };

    return (
        <div className="border h-[23px]">
            {window === "login" ?
                <div>
                    <h2>Log in</h2>
                    <form onSubmit={handleLogin}>
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
                    <button onClick={() => { setWindow('register') }}>I don't have an account</button>
                </div>
                :
                <div>
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
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
                    <button onClick={() => { setWindow('login') }}>I have an account</button>
                </div>
            }
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;

import React from "react";
import { useState } from "react";
import '../styles/input.css'


function Login() {
    const [Window, setWindow] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(Window);
    const login=()=>{
        href.location = "/jabber";

    }

    const register=()=>{
        setWindow('login');
    }

    return (
        <div className="border h-[23px]">
        {Window == "login" ?
         <div>
                <h2>Log in</h2>
                <form onSubmit={login}>
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
         <button onClick={()=>{setWindow('register')}}>I dont have account</button>
       </div>
       :
       <div>
      <h2>Register</h2>
      <form onSubmit={register}>
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
        <button type="submit">Registrarse</button>
      </form>
      <button onClick={()=>{setWindow('login')}}>I have account</button>
    </div>
        }
    </div>
    );
}
export default Login;
import React, { useState } from "react";
import axios from "axios";
import '../styles/input.css'
function Home() {
    return (
        <div>
            <h1>Home</h1>
            <button className="buttonG"><a href="/login">Login</a></button>
        </div>
    );
}
export default Home;
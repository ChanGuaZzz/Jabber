import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/input.css'
function Jabber() {
    useEffect(() => {
    axios.get('http://localhost:5000/api/getsession', { withCredentials: true })
    .then(response => {
        console.log(response);

        response.data.session.username
        ?console.log("")
        : window.location.href = "/login";
    })
    .catch(error => {
        window.location.href = "/login";
    });
    }, []);

    const logout=() => {
        axios.get('http://localhost:5000/api/logout', { withCredentials: true })
            .then(response => {
                window.location.href = "/login";
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    return (
        <div>
            <h1>Jabber</h1>

            <button onClick={logout}>Log Out</button>
        </div>
    );
}
export default Jabber;
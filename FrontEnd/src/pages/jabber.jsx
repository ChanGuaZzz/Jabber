import React, { useEffect, useState } from "react";
import axios from "axios";
import {io} from "socket.io-client"
import '../styles/input.css'

const socket = io('http://localhost:5000', { withCredentials: true });
function Jabber() {
    const [username, setUsername] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [ischatting, setIschatting] = useState(false);
    
    useEffect(() => {
        socket.on('message', (data) => {
            // Actualiza los mensajes recibidos del servidor
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        setRooms([
            {"id": 1, "name": "English", "description": "englishpeople"},
            {"id": 2, "name": "Spanish", "description": "spanishpeople"},
            {"id": 3, "name": "French", "description": "frenchpeople"},
            {"id": 4, "name": "German", "description": "germanpeople"},
        ]);
        console.log(rooms[0],'dwdwdw');
    }, []);

    useEffect(() => {
        if (currentRoom) {
            axios.get(`http://localhost:5000/api/messages/${currentRoom}`)
            .then((response) => {
                setMessages(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, [currentRoom]);

    
    
    useEffect(() => {
    axios.get('http://localhost:5000/api/getsession', { withCredentials: true })
    .then(response => {
        console.log(response);
        if(response.data.session.username){
            setLoggedIn(true)
            setUsername(response.data.session.username)
        }else{
            window.location.href = "/login";
        }
    })
    .catch(error => {
        console.log(error);
    });
    }, []);

    useEffect(() => {
        if (loggedIn && currentRoom)
        socket.emit('join', { currentRoom });
    }, [currentRoom]);

    const logout=() => {
        axios.get('http://localhost:5000/api/logout', { withCredentials: true })
            .then(response => {
                window.location.href = "/login";
            })
            .catch(error => {
                console.log(error);
            });
    }

    const sendMessage = () => {
        // Función para enviar un mensaje
        const messageData = {
            currentRoom,
            message,
            username,
        };

        socket.emit('message', messageData);
        // Limpiar el campo de mensaje después de enviarlo
        setMessage('');
    };
    
    return (
        <div>
            <h1>Jabber</h1>
            <p>Welcome, {username}</p>
            <button className="buttonLogout" onClick={logout}>Log Out</button>

            <div>
                <h2>Available rooms</h2>
                <ul>
                    {rooms.map(room => (
                        <button className="buttonG" key={room.id} onClick={() => setCurrentRoom(room.name)}>
                            {room.name}
                        </button>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Chat in {currentRoom}</h2>
                <div className="flex flex-col messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            {msg.content  && (
                             <p className={`${msg.username == username?'me':'them'} chatmessage`}><strong>{msg.username}:</strong> {msg.content}</p>
                           )}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}
export default Jabber;
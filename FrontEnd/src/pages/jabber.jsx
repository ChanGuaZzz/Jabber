import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {io} from "socket.io-client"
import '../styles/input.css'
import SendIcon from "../components/sendicon";

const socket = io('http://localhost:5000', { withCredentials: true });
function Jabber() {
    const [username, setUsername] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [ischatting, setIschatting] = useState(false);
    const scrollRef = useRef(null);
    const [scrollbutton, setScrollbutton] = useState(false);
    const hscrollRef = useRef(null);
    const scrollToBottom = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollbutton]);

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
            {"id": 5, "name": "Italian", "description": "italianpeople"},
            {"id": 6, "name": "Portuguese", "description": "portuguesepeople"},
            {"id": 7, "name": "Russian", "description": "russianpeople"},
            {"id": 8, "name": "Chinese", "description": "chinesepeople"},
            {"id": 9, "name": "Japanese", "description": "japanesepeople"},
            {"id": 10, "name": "Korean", "description": "koreanpeople"},
            {"id": 11, "name": "Arabic", "description": "arabicpeople"},
            {"id": 12, "name": "Hindi", "description": "hindipeople"},
            {"id": 13, "name": "Bengali", "description": "bengalipeople"},
            {"id": 14, "name": "Urdu", "description": "urdupeople"},
            {"id": 15, "name": "Turkish", "description": "turkishpeople"},
            {"id": 16, "name": "Dutch", "description": "dutchpeople"},
            {"id": 17, "name": "Polish", "description": "polishpeople"},
            {"id": 18, "name": "Greek", "description": "greekpeople"},
            {"id": 19, "name": "Swedish", "description": "swedishpeople"},
            {"id": 20, "name": "Danish", "description": "danishpeople"},
            
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

    const Hscroll = (e) => {
        if (hscrollRef.current) {
            hscrollRef.current.scrollLeft += e.deltaY;
          }}
    return (
        <div className="w-full h-full">
             
            <div className=" flex flex-row h-[8vh] mb-1">
                <button className="buttonLogout rounded-full " onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                </button>
                <div className="overflow-y-auto  w-[100%] bg-slate-900 ps-2 flex rounded-l-2xl ">
                    <div ref={hscrollRef} onWheel={Hscroll} className="overflow-y-auto scrollbar flex flex-row  rounded-l-2xl ">
                            {rooms.map(room => (
                                <button className=" bg-slate-600 text-white text-[80%] py-0 rounded-full m-1 p-2 " key={room.id} onClick={() => {setCurrentRoom(room.name); setIschatting(true)}}>
                                    {room.name}
                                </button>
                            ))}
                    </div>
                </div>
            </div>
            
            <div className="Chat ">
            {ischatting 
            ?
            <>
                <div className=" flex items-center justify-center bg-orange-700 w-full h-[6vh]  "><h2 className="text-shadow font-semibold">Chat in {currentRoom}</h2></div> 
                <div className="">
                    <div className="flex flex-col h-[80vh] pb-6 bg-chat rounded-md messages-container overflow-auto scrollbar-dark"  ref={scrollRef}>
                        {messages.map((msg, index) => (<>
                        {msg.content  && (
                            <div key={index} className="message">
                                
                                <p className={`${msg.username == username?'me':'them'} chatmessage`}><strong>{msg.username}:</strong> {msg.content}</p>
                            
                            </div>)
                            }
                       </> ))}
                    </div>
                    <button onClick={()=>setScrollbutton(!scrollbutton)} className=" bg-lime-600 w-[5vw] h-[5vh] items-center fixed flex top-[86vh] left-[80vw] rounded-full justify-center opacity-75">V</button>
                    <div className=" bg-slate-900 w-full fixed top-[92.4vh] flex items-center justify-center inputchat  ">
                        <input
                            className="text-left w-5/6 bg-slate-600 border-none rounded-2xl "
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {if (e.key === 'Enter') { sendMessage() }}}
                        />
                        {message.length>0
                        ?<button  className="w-1/6 flex justify-center buttonSend rounded-full " onClick={sendMessage}><SendIcon/></button>
                        :<button disabled className="w-1/6 flex justify-center buttonSend rounded-full opacity-50 pointer-events-none" onClick={sendMessage}><SendIcon/></button>
                        }
                    </div>
                </div>
            </>
            :
            <>
            <div className="flex flex-col justify-center items-center">
                <p className="text-red-600 text-2xl">Welcome, {username}</p>
                <h2 className=" ">Select a room to chat</h2>
            </div>
                </>
            }
            </div>
             
        </div>
    );
}
export default Jabber;
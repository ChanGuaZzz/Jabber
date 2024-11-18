import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/input.css";
import SendIcon from "../components/sendicon";
import MessageComponent from "../components/messagecomponent";
import { Filter } from "bad-words";
const filter = new Filter();
const socket = io('https://jabberapisecretsdfgdfgehtjf.onrender.com', {
  withCredentials: true,
  transports: ['websocket'],
});
function Jabber() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [ischatting, setIschatting] = useState(false);
  const scrollRef = useRef(null);
  const [scrollbutton, setScrollbutton] = useState(false);
  const hscrollRef = useRef(null);
  const [buttonanimation, setbuttonanimation] = useState("buttonwelcomebefore");
  const [loading, setloading] = useState(false);
  const [buttonwelcome, setbuttonwelcome] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState();
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollbutton]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('message', (message) => {
      console.log('New message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

  }, [socket]);

  useEffect(() => {
    setRooms([
      { id: 1, name: "English", description: "englishpeople" },
      { id: 2, name: "Spanish", description: "spanishpeople" },
      { id: 3, name: "French", description: "frenchpeople" },
      { id: 4, name: "German", description: "germanpeople" },
      { id: 5, name: "Italian", description: "italianpeople" },
      { id: 6, name: "Portuguese", description: "portuguesepeople" },
      { id: 7, name: "Russian", description: "russianpeople" },
      { id: 8, name: "Chinese", description: "chinesepeople" },
      { id: 9, name: "Japanese", description: "japanesepeople" },
      { id: 10, name: "Korean", description: "koreanpeople" },
      { id: 11, name: "Arabic", description: "arabicpeople" },
      { id: 12, name: "Hindi", description: "hindipeople" },
      { id: 13, name: "Bengali", description: "bengalipeople" },
      { id: 14, name: "Urdu", description: "urdupeople" },
      { id: 15, name: "Turkish", description: "turkishpeople" },
      { id: 16, name: "Dutch", description: "dutchpeople" },
      { id: 17, name: "Polish", description: "polishpeople" },
      { id: 18, name: "Greek", description: "greekpeople" },
      { id: 19, name: "Swedish", description: "swedishpeople" },
      { id: 20, name: "Danish", description: "danishpeople" },
    ]);
    console.log(rooms[0], "dwdwdw");
  }, []);

  useEffect(() => {
    if (loggedIn && currentRoom) {
      // socket.emit("join", { currentRoom, username });
      setloading(true);
      axios
        .get(`https://jabberweb.onrender.com/api/api/messages/${currentRoom}`)
        .then((response) => {
          setloading(false);
          setMessages(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentRoom]);

  useEffect(() => {
    axios
      .get("https://jabberweb.onrender.com/api/api/getsession", { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.data.message == "No session data found." ) {
          window.location.href = "/login";
        } else {
          setLoggedIn(true);
          setUsername(response.data.username);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {}, [currentRoom]);

  const logout = () => {
    axios
      .get("https://jabberweb.onrender.com/api/api/logout", { withCredentials: true })
      .then((response) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendMessage = () => {
    // Función para enviar un mensaje
    const cleanMessage = filter.clean(message);
    console.log(message, "limpiado", cleanMessage);
    const messageData = {
      currentRoom,
      message: cleanMessage,
      username,
    };

    socket.emit("message", messageData);
    // Limpiar el campo de mensaje después de enviarlo
    setMessage("");
  };

  const Hscroll = (e) => {
    if (hscrollRef.current) {
      hscrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const putAnimation = () => {
    if (buttonanimation === "buttonwelcomebefore") {
      setbuttonanimation("buttonwelcome");
      setTimeout(() => {
        setbuttonwelcome(true);
      }, 200);
    }
  };
  return (
    <div className="size-full">
      <div className=" flex flex-row h-[8%] mb-1">
        <button className="buttonLogout m-2 button rounded-xl flex justify-center items-center  " onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
        <div className="overflow-y-auto  w-full bg-[#c7c7c7] ps-2 flex rounded-l-2xl ">
          <div ref={hscrollRef} onWheel={Hscroll} className="overflow-y-auto scrollbar flex flex-row  rounded-l-2xl ">
            {rooms.map((room, index) => (
              <button
                className={`button bg-[#5a5a5a] text-white text-[80%] py-0 rounded-full m-1 p-2 ${
                    currentRoomIndex === index ? "bg-[#ff8a24]" : ""
                  }`}
                  key={room.id}
                onClick={() => {
                  setCurrentRoom(room.name);
                  setCurrentRoomIndex(index);
                  setIschatting(true);
                }}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="Chat h-[90%]">
        {ischatting ? (
          <>
            <div className=" flex items-center justify-center bg-orange-700 w-full h-[6vh]  ">
              <h2 className="text-shadow font-semibold">Chat in {currentRoom}</h2>
            </div>
            <div className="">
              <div className="flex flex-col h-[80vh] pb-14 pt-6 bg-chat rounded-md messages-container overflow-auto scrollbar-dark" ref={scrollRef}>
                {loading ? (
                  <div className="absolute bg-black w-full h-[80%] bg-opacity-60 backdrop-blur-sm ">
                    <div className=" loadinganimation size-full flex justify-center items-center text-white">
                      <div className=" size-2 mx-1 bg-white rounded-full transition-all"></div>
                      <div className="size-2 mx-1 bg-white rounded-full transition-all"></div>
                      <div className="size-2 mx-1 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div key={index}>
                        {console.log("usuario enviador", msg.username,"usuario actual", username, (msg.username == username ? true : false))}
                        {msg.content && (
                          <MessageComponent
                            messageid={msg.messageid}
                            isMe={msg.username == username ? true : false}
                            message={msg.content}
                            sender={msg.username}
                            time={msg.timestamp}
                          />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
              <button
                onClick={() => setScrollbutton(!scrollbutton)}
                className=" button  bg-lime-600 w-[40px] h-[40px] backdrop-blur-sm shadow-black shadow-md text-white my-2 items-center fixed flex bottom-[70px] right-[20px] rounded-full justify-center opacity-75"
              >
                <ion-icon name="chevron-down-circle-outline" size="large"></ion-icon>
              </button>
              <div className=" bg-slate-900 w-full fixed top-[92.4vh] flex items-center justify-center inputchat  ">
                <input
                  className="text-left w-5/6 bg-slate-600 border-none rounded-2xl "
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                {message.length > 0 ? (
                  <button className=" w-1/6 flex justify-center buttonSend rounded-full " onClick={sendMessage}>
                    <SendIcon />
                  </button>
                ) : (
                  <button disabled className="  w-1/6 flex justify-center buttonSend rounded-full opacity-50 pointer-events-none" onClick={sendMessage}>
                    <SendIcon />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className=" size-full flex flex-col pt-[30%] items-center">
              <div className="flex welcome flex-col justify-center items-center rounded-2xl bg-">
                <p className="text-white font-extrabold text-6xl transition-all  m-10">Welcome</p>
                <h2 className={` opacity-40  text-sm text-center mb-4  mx-8`}>Your portal to connect and chat with people around the world. Join a room and start your global conversation now!</h2>
                <button onClick={() => putAnimation()} className={`p-5 ${buttonanimation} bg-white opacity-100 flex justify-center h-[60px] w-[220px]  items-center border rounded-full text-black shadow-gray-700 shadow-xl text-dsm`}>{buttonwelcome?<ion-icon name="arrow-up-circle-outline" size="large"></ion-icon>:"Select a room to chat"}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Jabber;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/input.css";
import SendIcon from "../components/sendicon";
import MessageComponent from "../components/messagecomponent";
import { Filter } from "bad-words";
const filter = new Filter();
const socket = io(`${import.meta.env.VITE_API_URL_SOCKET}`, {
  withCredentials: true,
  transports: ["websocket"],
});

function Jabber() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
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
  const [loading, setLoading] = useState(false);
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
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("message", (message) => {
      console.log("New message:", message);
      if (message.senderId !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.tempMessageId === message.tempMessageId ? message : msg
          )
        );
      }
    });

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageid !== messageId));
      console.log("Message deleted:", messageId);
    });

    socket.on("message_edited", ({ messageId, content }) => {
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.messageid === messageId ? { ...msg, content } : msg)));
      console.log("Message edited:", messageId);
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
      { id: 21, name: "Norwegian", description: "norwegianpeople" },
      { id: 22, name: "Finnish", description: "finnishpeople" },
      { id: 23, name: "Hungarian", description: "hungarianpeople" },
      { id: 24, name: "Czech", description: "czechpeople" },
      { id: 25, name: "Slovak", description: "slovakpeople" },
      { id: 26, name: "Romanian", description: "romanianpeople" },
      { id: 27, name: "Bulgarian", description: "bulgarianpeople" },
      { id: 28, name: "Serbian", description: "serbianpeople" },
      { id: 29, name: "Croatian", description: "croatianpeople" },
      { id: 30, name: "Bosnian", description: "bosnianpeople" },
      { id: 31, name: "Slovenian", description: "slovenianpeople" },
      { id: 32, name: "Macedonian", description: "macedonianpeople" },
      { id: 33, name: "Albanian", description: "albanianpeople" },
      { id: 34, name: "Lithuanian", description: "lithuanianpeople" },
      { id: 35, name: "Latvian", description: "latvianpeople" },
      { id: 36, name: "Estonian", description: "estonianpeople" },
      { id: 37, name: "Georgian", description: "georgianpeople" },
      { id: 38, name: "Armenian", description: "armenianpeople" },
      { id: 39, name: "Azerbaijani", description: "azerbaijanipeople" },
      { id: 40, name: "Hebrew", description: "hebrewpeople" },
    ]);
    console.log(rooms[0], "dwdwdw");
  }, []);

  useEffect(() => {
    if (loggedIn && currentRoom) {
      socket.emit("join", { currentRoom, userId });
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/messages/${currentRoom}`)
        .then((response) => {
          setLoading(false);
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
      .get(`${import.meta.env.VITE_API_URL}/api/getsession`, { withCredentials: true })

      .then((response) => {
        console.log(response);
        if (response.data.message == "No session data found.") {
          window.location.href = "/login";
        } else {
          setLoggedIn(true);
          setUsername(response.data.username);
          setUserId(response.data.userId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {}, [currentRoom]);

  const logout = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/logout`, { withCredentials: true })

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
    const tempMessageId = `temp-${Date.now()}-${userId}`;
    const messageData = {
      currentRoom,
      message: cleanMessage,
      userId,
      messageid: tempMessageId,
      tempMessageId: tempMessageId,
    };
  
    // Añadir el mensaje temporalmente al estado
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        username,
        senderId: userId,
        content: cleanMessage,
        timestamp: new Date().toISOString(),
        messageid: null,
        tempMessageId: tempMessageId,
        room: currentRoom,
      },
    ]);
  
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
    <div className="w-full h-screen">
      <div className=" flex flex-row items-center h-[80px] py-1">
        <button className="buttonheader ml-2 button rounded-xl flex justify-center items-center  " onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
        <a className="buttonheader  m-2 button rounded-xl flex justify-center items-center  " href="/profile">
          <ion-icon name="person-circle-outline" size="large"></ion-icon>
        </a>
        <div className="overflow-y-auto h-full  w-full bg-gray-700 ps-2 flex rounded-l-2xl ">
          <div ref={hscrollRef} onWheel={Hscroll} className="overflow-y-auto scrollbar flex flex-row  rounded-l-2xl ">
            {rooms.map((room, index) => (
              <button
                className={`button  text-white text-[80%] py-0 rounded-full m-1 p-2 ${currentRoomIndex === index ? "bg-[#f97316]" : "bg-[#00000046]"}`}
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

      <div className="Chat h-[90%] flex flex-col">
        {ischatting ? (
          <>
              <div className=" flex items-center justify-center bg-gray-800 w-full h-[6vh]  ">
                <h2 className="text-shadow font-semibold">Chat in {currentRoom}</h2>
              </div>
              <div className="">
                <div className="flex flex-col h-[85vh] pb-16  bg-chat rounded-md messages-container overflow-auto scrollbar-dark" ref={scrollRef}>
                  {loading ? (
                    <div className="absolute bg-black w-full h-full bg-opacity-60 backdrop-blur-sm ">
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
                          {console.log("usuario enviador", msg.senderId, "usuario actual", userId)}
                          {msg.content && (
                            <MessageComponent
                              messageid={msg.messageid}
                              isMe={msg.senderId == userId ? true : false}
                              message={msg.content}
                              sender={msg.username}
                              time={msg.timestamp}
                              userId={msg.senderId}
                            />
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <button
                  onClick={() => setScrollbutton(!scrollbutton)}
                  className=" button  bg-[#f97316] bg-opacity-70 w-[40px] h-[40px] backdrop-blur-sm shadow-black shadow-md text-white my-2 items-center fixed flex bottom-[80px] right-[20px] rounded-full justify-center opacity-50 hover:opacity-100"
                >
                  <ion-icon name="chevron-down-circle-outline" size="large"></ion-icon>
                </button>
                <div className=" bg-slate-9 w-full h-14 border-t-[1px] bg-[#0c1523] border-gray-700 px-[5%]   fixed bottom-0  flex items-center justify-center inputchat ">
                  <input
                    className="text-left w-[90%] h-[70%] pl-3  border-gray-700 border rounded-2xl "
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
                    <button className=" h-[70%] w-[10%] w-max-[150px] flex justify-center items-center buttonSend rounded-full " onClick={sendMessage}>
                                            <span className={`pr-3 hidden md:block`}>Send</span>

                      <ion-icon name="paper-plane-outline" size="small"></ion-icon>

                    </button>
                  ) : (
                    <button
                      disabled
                      className=" h-[70%] w-[10%] w-max-[150px]  flex justify-center items-center buttonSend rounded-full opacity-50 pointer-events-none"
                      onClick={sendMessage}
                    >
                      <span className={`pr-3 hidden md:block`}>Send</span>
                      <ion-icon name="paper-plane-outline" size="small"></ion-icon>

                    </button>
                  )}
                </div>
              </div>
          </>
        ) : (
          <>
            <div className=" size-full flex flex-col pt-[200px] items-center">
              <div className="flex welcome flex-col justify-center items-center rounded-2xl bg-">
                <p className="text-white font-extrabold text-6xl transition-all  m-10">Welcome </p>

                <h2 className={` opacity-40  text-sm text-center mb-4  mx-8`}>
                  Your portal to connect and chat with people around the world. Join a room and start your global conversation now!
                </h2>
                <button
                  onClick={() => putAnimation()}
                  className={`p-5 ${buttonanimation} bg-white opacity-100 flex justify-center h-[60px] w-[220px] mt-10  items-center border rounded-full text-blacktext-dsm`}
                  style={{boxShadow:  "16px 16px 35px #0e131b,-16px -16px 35px #28354b"}}
                >
                  {buttonwelcome ? <ion-icon name="arrow-up-circle-outline" size="large"></ion-icon> : "Select a room to chat"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Jabber;

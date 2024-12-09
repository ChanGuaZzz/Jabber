import React from "react";
import { Link } from "react-router-dom";
import "../styles/input.css";

function Home() {
  return (
    <div className="size-full flex pt-11 px-11 flex-col  items-center bg-gray-900 text-white">
      <div className="flex flex-col h-[90%] justify-center items-center ">
        <h1 className="text-5xl p-[1vh] font-bold">Jabber</h1>
        <p className="text-[2vh] p-6 text-center max-w-[500px]">
          Bienvenido a Jabber, la aplicación web que te permite conectarte y chatear con personas de todo el mundo. Únete a una sala y comienza tu conversación
          global ahora. Ya sea que quieras practicar un nuevo idioma, conocer nuevas culturas o simplemente hacer nuevos amigos, Jabber es el lugar perfecto
          para ti.
        </p>

        <Link to="/login" className=" transition-colors py-[2vh] w-[30vh] rounded-full text-center bg-orange-600 hover:bg-orange-800">
          Iniciar
        </Link>
      </div>
      <div className=" flex flex-col justify-end items-center pb-7 w-[100%] h-[20%] ">
        <div className="flex justify-evenly max-w-[500px] w-[90%] items-center">
          <Link to={"https://www.linkedin.com/in/geyson-steven-gualdron-arjona-b22b99273/"} className=" text-blue-700  hover:text-blue-600">
            <ion-icon name="logo-linkedin" size="large"></ion-icon>
          </Link>
          <Link to={"https://github.com/ChanGuaZzz"} className=" text-white hover:text-gray-500">
            <ion-icon name="logo-github" size="large"></ion-icon>
          </Link>
          <Link to={"https://www.instagram.com/gxxsonhub/?hl=es"} className=" text-fuchsia-700 hover:text-fuchsia-600">
            <ion-icon name="logo-instagram" size="large"></ion-icon>
          </Link>
          <Link to={"https://geysongualdron.onrender.com"} className=" text-white hover:text-gray-500">
            <ion-icon name="person-circle-outline" size="large"></ion-icon>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

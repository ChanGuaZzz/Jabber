import React from "react";
import "../styles/input.css";
import logo from "../img/logo.png";

function Loading() {
  return (
    <div className="fixed z-[1000] backdrop-blur-sm flex justify-center items-center bg-black size-full opacity-75">
      <div className="flex flex-col items-center justify-center h-[20%] w-full">
        <img src={logo} className="opacity-70" alt="Nothere" />
        <div className=" loadinganimation size-full flex justify-center items-center text-white">
          <div className=" size-2 mx-1 bg-white rounded-full transition-all"></div>
          <div className="size-2 mx-1 bg-white rounded-full transition-all"></div>
          <div className="size-2 mx-1 bg-white rounded-full transition-all"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;

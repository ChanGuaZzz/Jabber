import React from "react";
import "../styles/input.css";

function Loading() {
  return (
    <div className="absolute bg-black size-full opacity-75">
      <div className="flex items-center justify-center h-full w-full">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loading;

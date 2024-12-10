import React from "react";
import { Link } from "react-router-dom";
import "../styles/input.css";
import { Navbar } from "../components/Navbar";
import { Globe, Users, MessageCircle } from "lucide-react";
import { Features } from "../components/Features";

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 ">
      <Navbar />
      <main>
        <div className="pt-28 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Connect Globally with</span>
                <span className="block text-[#fd5000]">Jabber</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Chat with people from around the world, practice new languages, and make friends across cultures. Join a room and start your global conversation
                today.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to={"/login"}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#fd5000] transition-colors duration-300 hover:bg-yellow-400 md:py-4 md:text-lg md:px-10"
                  >
                    Start Chatting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Features />
        <div id="social" className="w-full h-32 bg-[#111827]">
            <div className="flex flex-col items-center  size-full justify-center ">
              <div className="flex items-center justify-evenly w-[60%] my-4 max-w-[500px]  ">
                <Link to={"https://www.linkedin.com/in/geyson-steven-gualdron-arjona-b22b99273/"} className="transition-colors text-sky-600 hover:text-sky-800 ">
                <ion-icon name="logo-linkedin" size="large"></ion-icon>
                </Link>
                <Link to={"https://github.com/ChanGuaZzz"} className="transition-colors text-white hover:text-slate-600">
                <ion-icon name="logo-github" size="large"></ion-icon>
                </Link>
                <Link to={"https://www.instagram.com/gxxsonhub/?hl=es"} className="transition-colors text-pink-600 hover:text-pink-800">
                <ion-icon name="logo-instagram" size="large"></ion-icon>
                </Link>
                <Link to={"https://geysongualdron.onrender.com/"} className="transition-colors text-white  hover:text-slate-600">
                <ion-icon name="person-circle-outline" size="large"></ion-icon>
                </Link>
              </div>
              <p className="text-gray-300 pb-">© 2021 Jabber. All rights reserved.</p>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

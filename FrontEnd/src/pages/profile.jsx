import axios from "axios";
import React, { useEffect } from "react";

function Profile() {
  const [userId, setUserId] = React.useState();
  const [userData, setUserData] = React.useState({});

  useEffect(() => {
    axios
      .get("https://jabberweb.onrender.com/api/api/getsession", { withCredentials: true })
      // .get("http://127.0.0.1:10000/api/getsession", { withCredentials: true })
      .then((res) => {
        console.log("sessiones", res);
        setUserId(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    axios
      .get(`https://jabberweb.onrender.com/api/api/profile`, { withCredentials: true })
      // .get(`http://127.0.0.1:10000/api/profile`, { withCredentials: true })
      .then((res) => {
        console.log("user", res);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  return (
    <>
      <div className="size-full flex flex-col  items-center">
        <header className="bg-[#e64900] h-[8%] w-full flex justify-center items-center text-white">
          <a href="/jabber" className="absolute left-2 buttonheader button bg-amber-800 rounded-2xl flex justify-center items-center">
            <ion-icon name="arrow-back-circle-outline" size={"large"}></ion-icon>
          </a>
          <h1 className="font-extrabold text-xl">PROFILE</h1>
        </header>
        <main className=" h-[92%] w-full flex flex-col p-10 items-center ">
          <div className="text-white text-9xl size-[200px] flex justify-center items-center p-6 bg-[#515151] rounded-full">
            <ion-icon name="person-outline" ></ion-icon>
          </div>
          <p className="text-white text-3xl font-semibold m-9">@{userData.username} </p>
          <p className="text-white text-sm opacity-85 m-2">{userData.email} </p>
          <p className={`text-white text-sm opacity-45 ${userData.language ? "opacity-85":"opacity-45"} m-4`}>{userData.language ? userData.language : "no Language defined"} </p>
          <p className={`text-white text-sm  ${userData.location ? "opacity-85":"opacity-45"} m-4`}>{userData.location ? userData.location : "No location defined"} </p>
        </main>
      </div>
    </>
  );
}
export default Profile;

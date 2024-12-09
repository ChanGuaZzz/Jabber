import axios from "axios";
import { useEffect, useState } from "react";

function ModalViewUser({ userId, setViewUser }) {
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/profile/${userId}`, { withCredentials: true })
      .then((res) => {
        console.log("user", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>

    <div onClick={()=>{setViewUser(false)} } className="fixed top-0 bottom-0 right-0 left-0 bg-black z-50 bg-opacity-75">
        <div className="size-full flex p-36 items-center flex-col">
            <span className="text-white text-2xl p-6">@{userData.username}</span>
            <div className="text-white text-9xl size-[200px] flex justify-center items-center bg-[#515151] rounded-full">
            <ion-icon name="person-outline"></ion-icon>
          </div>
            <div className="text-white text-2xl p-6">{userData.email}</div>
            
        </div>
    </div>
    </>
  );
}

export default ModalViewUser;

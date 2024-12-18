import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { set } from "date-fns";

function ModalViewUser({ userId, setViewUser }) {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/profile/${userId}`, { withCredentials: true })
      .then((res) => {
        console.log("user", res.data);
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div
        onClick={() => {
          setViewUser(false);
        }}
        className="fixed top-0 bottom-0 right-0 left-0 bg-black z-50 bg-opacity-55 backdrop-blur-sm"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="size-full flex p-36 items-center flex-col">
            <span className="text-white text-2xl p-6">@{userData.username}</span>
            <div className="text-white text-[15vh] m-5 size-[25vh] flex justify-center items-center bg-[#f97316] rounded-full">
              <ion-icon name="person-outline"></ion-icon>
            </div>
            <div className="text-white text-center text-[80%] md:text-lg m-3 p-2 w-full rounded-full bg-[#f97316]">{userData.languages || "No defined"}</div>
            <div className="text-white text-center text-[80%] md:text-lg m-3 p-2 w-full rounded-full bg-blue-500">{userData.location || "No defined"}</div>

          </div>
        )}
      </div>
    </>
  );
}

export default ModalViewUser;

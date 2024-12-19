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
          <div className="size-full justify-center flex p-[10%] items-center flex-col">
            <div className="w-full max-w-[700px] flex flex-col items-center px-[30px] py-[50px] bg-gray-800 rounded-2xl">
              <div className="flex w-full justify-start items-center pb-[20px]">
                <div className="text-white text-[40px]  size-[70px] flex justify-center items-center bg-[#f97316] rounded-full">
                  <ion-icon name="person-outline"></ion-icon>
                </div>
                <div className="flex flex-col pl-6  justify-center">
                  <span className="text-white text-2xl font-semibold">{userData.username}</span>
                  <span className="text-white text-lg  opacity-50">@{userData.username}</span>
                </div>
              </div>
              <div className="text-[80%] md:text-lg my-3 w-full flex text-[#f97316]">
                <div className="flex items-center"><ion-icon name="location-outline" size="small"></ion-icon></div>
                <span className="text-white px-3">{userData.location || "No defined"}</span>
              </div>
              <div className="text-[80%] md:text-lg mt-3  w-full flex text-[#f97316]">
              <div className="flex items-center"><ion-icon name="globe-outline" size="small"></ion-icon></div>
                <span className="text-white px-3">Native Language</span>
              </div>
              <div className="text-[80%] md:text-lg mt-5 w-full flex text-[#f97316]">
                <span className="text-white px-3 py-1 bg-white bg-opacity-10 rounded-full ">{userData.languages || "No defined"}</span>{" "}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ModalViewUser;

import axios from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import Loading from "../components/loading";
import EditButton from "../components/editbutton";

function Profile() {
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getsession`, { withCredentials: true })

      .then((response) => {
        console.log(response);
        if (response.data.message == "No session data found.") {
          window.location.href = "/login";
        } else {
          setUserId(response.data.userId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/profile`, { withCredentials: true })
      .then((res) => {
        console.log("user", res);
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <>
      {loading && <Loading />}
      <div className="w-full h-full lg:h-screen flex flex-col items-center">
        <header className=" h-[80px] w-full flex justify-between px-6 py-16 items-center text-white">
          <div className="flex">
            <a href="/jabber" className=" h-full p-1 ">
              <div className="buttonheader flex justify-center p-3 items-center button rounded-2xl">
                <ion-icon name="arrow-back-outline" size="small"></ion-icon>
              </div>
            </a>
            <h1 className="font-medium px-3 text-2xl">User Profile</h1>
          </div>
          <div className="text-white  size-[50px] flex text-xl justify-center items-center bg-[#f97316] rounded-full ">
            <ion-icon name="person-outline"></ion-icon>
          </div>
        </header>
        <main className=" w-full h-full flex flex-col  items-center ">
          <div className="flex w-full flex-wrap justify-center">
            <div className="w-[80%] lg:w-[35%] m-5 bg-white bg-opacity-10 p-5 text-white rounded-lg">
              <p className="text-lg">Personal Information</p>
              <div className="my-6 text-sm flex flex-col w-full bg-">
                <p className="opacity-50">Username</p>
                <EditButton setLoading={setLoading} value={userData.username} setValue={setUserData} name="username" isusername={1} sendEdit={() => {}} />
              </div>
              <div className="my-3 text-sm flex flex-col w-full bg-">
                <p className="opacity-50">Email</p>
                <EditButton setLoading={setLoading} value={userData.email} isemail={1} setValue={setUserData} name="email" />
              </div>
            </div>
            <div className="w-[80%] lg:w-[35%] m-5 bg-white bg-opacity-10 p-5 text-white rounded-lg">
              <p className="text-lg">Additional</p>
              <div className="my-6 text-sm flex flex-col w-full bg-">
                <p className="opacity-50">Location</p>
                <EditButton setLoading={setLoading} value={userData.location} setValue={setUserData} name="location" islocation={1} />
              </div>
              <div className="my-3 text-sm flex flex-col w-full bg-">
                <p className="opacity-50">Native Language</p>
                <EditButton setLoading={setLoading} value={userData.languages} setValue={setUserData} name="languages" islanguages={1} />
              </div>
            </div>
          </div>
          <div className="w-[80%] lg:w-[70%] my-5 bg-white bg-opacity-10 p-5 text-white rounded-lg">
            <p className="text-lg">Security</p>

            <div className="my-3 text-sm flex flex-col w-full bg-">
              <p className="opacity-50">Change Password</p>
              <EditButton setLoading={setLoading} value={"Password"} setValue={setUserData} name="password" ispassword={1} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
export default Profile;

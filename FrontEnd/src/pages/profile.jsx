import axios from "axios";
import { set } from "date-fns";
import  { useEffect , useState } from "react";
import Loading from "../components/loading";
import EditButton from "../components/editbutton";

function Profile() {
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://jabberweb.onrender.com/api/api/getsession", { withCredentials: true })
      // .get("http://127.0.0.1:10000/api/getsession", { withCredentials: true })

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
      .get(`https://jabberweb.onrender.com/api/api/profile`, { withCredentials: true })
      // .get(`http://127.0.0.1:10000/api/profile`, { withCredentials: true })
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
  }
  , [userData]);
  

  return (
    <>
      {loading && <Loading />}
      <div className="size-full flex flex-col  items-center">
        <header className="bg-[#e64900] h-[8%] w-full flex justify-center items-center text-white">
          <a href="/jabber" className="absolute left-2 buttonheader button bg-amber-800 rounded-2xl flex justify-center items-center">
            <ion-icon name="arrow-back-circle-outline" size={"large"}></ion-icon>
          </a>
          <h1 className="font-extrabold text-xl">PROFILE</h1>
        </header>
        <main className=" h-[92%] w-full flex flex-col p-10 items-center ">
          <div className="text-white text-9xl size-[200px] flex justify-center items-center p-6 bg-[#515151] rounded-full">
            <ion-icon name="person-outline"></ion-icon>
          </div>
          <div className="mt-9 text-2xl ">
            {/* BUTTON DATOS */}
            <EditButton value={userData.username} setValue={setUserData} name="username" isusername={1} sendEdit={() => {}} />
            {/* BUTTON DATOS */}
            
          </div>
          <div className=" flex flex-col my-6 text-sm">
            <EditButton value={userData.email} isemail={1} setValue={setUserData} name="email" sendEdit={() => {}} />
            <EditButton value={userData.languages} canEmpty={1} setValue={setUserData} name="languages" sendEdit={() => {}} />
            <EditButton value={userData.location} canEmpty={1} setValue={setUserData} name="location" sendEdit={() => {}} />
          </div>
        </main>
      </div>
    </>
  );
}
export default Profile;

import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./loading";

function EditButton({ value, setValue, setLoading, canEmpty, isemail, isusername, name = "name" }) {
  const [edit, setEdit] = useState(false);
  const [newvalue, setNewValue] = useState();

  useEffect(() => {
    if (value) {
      setNewValue(value);
    }
  }, [value]);

  const saveData = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://jabberweb.onrender.com/api/api/profile", { [name]: newvalue }, { withCredentials: true })
    //   .post("http://127.0.0.1:10000/api/profile", { [name]: newvalue }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setValue((prevState) => ({
          ...prevState,
          [name]: newvalue,
        }));
        setEdit(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      {edit ? (
        <>
          <div className="my-2 relative border bg-white bg-opacity-50 rounded-full text-white text-center min-w-[300px]">
            <form onSubmit={saveData}>
              {isemail ? (
                <input
                  type="email"
                  required
                  className="w-[70%]"
                  value={newvalue}
                  onChange={(e) => {
                    setNewValue(e.target.value);
                  }}
                />
              ) : (
                <>
                  {!canEmpty ? (
                    <input
                      type="text"
                      maxLength={10}
                      required
                      minLength={5}
                      className="w-[70%]"
                      value={newvalue}
                      onChange={(e) => {
                        setNewValue(e.target.value);
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-[70%]"
                      value={newvalue}
                      onChange={(e) => {
                        setNewValue(e.target.value);
                      }}
                    />
                  )}
                </>
              )}

              <button className="absolute h-full top-0 right-[10%]">
                <ion-icon name="save-outline"></ion-icon>
              </button>
            </form>
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            setEdit(true);
          }}
          className="my-2 relative border bg-white bg-opacity-15 rounded-full text-white text-center min-w-[300px]"
        >
          <p className={` p-3 ${value ? "opacity-85" : "opacity-45"}`}>
            {isusername ? (
              <>
                <span className="text-[#e64900]">@</span>
                {value}{" "}
              </>
            ) : (
              <>{value ? value : `no ${name} defined`} </>
            )}
          </p>
          <button className="absolute h-full top-0 right-[10%]">
            <ion-icon name="create-outline"></ion-icon>
          </button>
        </button>
      )}
    </>
  );
}
export default EditButton;

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Loading from "./loading";
import { set } from "date-fns";
import AlertConfirm from "./AlertConfirm";

function EditButton({ value, setValue, setLoading, canEmpty, isemail, isusername, name = "name", ispassword }) {
  const [edit, setEdit] = useState(false);
  const [newvalue, setNewValue] = useState();
  const formRef = useRef(null);
  const [alertPassword, setAlertPassword] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");

  useEffect(() => {
    if (ispassword) {
      setNewValue("");
      setAlertPassword(false);
      return;
    }
    if (value) {
      setNewValue(value);
    }
  }, [value, edit]);

  const saveData = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (ispassword) {
      console.log("password");
      if (!alertPassword) {
        setAlertPassword(true);
        return;
      } else {
        setAlertPassword(false);
      }
    }

    setLoading(true);
    axios
       .post(`${import.meta.env.VITE_API_URL}/api/profile`, { [name]: newvalue }, { withCredentials: true })
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
        if (err.response && err.response.status === 400) {
          console.log(err.response.data.JabberMessages);
          setErrorMessagePassword(err.response.data.JabberMessages);
          setTimeout(() => {
            setErrorMessagePassword("");
          } , 10000);
        } else {
          console.log(err, "errorrrrr");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!alertPassword) {
      const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
          // Ejecutar la función deseada aquí
          console.log("Clicked outside");
          setEdit(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [alertPassword, formRef]);

  return (
    <>
      
      {alertPassword && (
        <AlertConfirm
          message={"You are about to change your password"}
          onClose={() => {
            setEdit(false);
          }}
          onConfirm={saveData}
        />
      )}
      {edit ? (
        <>
          <div ref={formRef} className="my-2 relative border bg-white bg-opacity-50 rounded-full text-white text-center min-w-[300px]">
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
                  {ispassword ? (
                    <input
                      type="password"
                      required
                      placeholder="New password"
                      className="w-[70%]"
                      minLength={10}
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
                          minLength={4}
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
                </>
              )}

              <button className="absolute h-full top-0 right-[10%]">
                <ion-icon name="save-outline"></ion-icon>
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="my-2 relative border bg-white bg-opacity-15 rounded-full text-white text-center min-w-[300px]">
          <button
            onClick={() => {
              setEdit(true);
            }}
            className="w-full h-full"
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
          </button>
          <button className="absolute h-full top-0 right-[10%]">
            <ion-icon name="create-outline"></ion-icon>
          </button>
        </div>
      )}
      {errorMessagePassword && <div className="text-red-500 text-center max-w-[300px]">{errorMessagePassword}</div>
        }
    </>
  );
}
export default EditButton;

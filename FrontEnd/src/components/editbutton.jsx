import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Loading from "./loading";
import AlertConfirm from "./AlertConfirm";
import Select from "react-select";
import countryList from "react-select-country-list";

const optionsLanguage = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Arabic", label: "Arabic" },
  { value: "Hindi", label: "Hindi" },
  { value: "Bengali", label: "Bengali" },
  { value: "Urdu", label: "Urdu" },
  { value: "Turkish", label: "Turkish" },
  { value: "Dutch", label: "Dutch" },
  { value: "Polish", label: "Polish" },
  { value: "Greek", label: "Greek" },
  { value: "Swedish", label: "Swedish" },
  { value: "Danish", label: "Danish" },
  { value: "Norwegian", label: "Norwegian" },
  { value: "Finnish", label: "Finnish" },
  { value: "Hungarian", label: "Hungarian" },
  { value: "Czech", label: "Czech" },
  { value: "Slovak", label: "Slovak" },
  { value: "Romanian", label: "Romanian" },
  { value: "Bulgarian", label: "Bulgarian" },
  { value: "Serbian", label: "Serbian" },
  { value: "Croatian", label: "Croatian" },
  { value: "Bosnian", label: "Bosnian" },
  { value: "Slovenian", label: "Slovenian" },
  { value: "Macedonian", label: "Macedonian" },
  { value: "Albanian", label: "Albanian" },
  { value: "Lithuanian", label: "Lithuanian" },
  { value: "Latvian", label: "Latvian" },
  { value: "Estonian", label: "Estonian" },
  { value: "Georgian", label: "Georgian" },
  { value: "Armenian", label: "Armenian" },
  { value: "Azerbaijani", label: "Azerbaijani" },
  { value: "Hebrew", label: "Hebrew" },
];

const InputField = ({ type, value, onChange, placeholder, minLength, maxLength }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    minLength={minLength}
    maxLength={maxLength}
    className="w-[60%] text-start"
    required
  />
);
const customStyles = {
  control: (provided) => ({ 
    ...provided,
    display: 'flex',
    flexWrap: 'nowrap',
    border: 'none',
    
  }),
  
  menu: (provided) => ({
    ...provided,
    background: '#192230',
    color: 'white',
  }),
};

const SelectField = ({ options, value, onChange }) => (
  <Select
    options={options}
    value={options.find(option => option.value === value || option.label === value)}
    onChange={onChange}
    className="w-[75%] "
    styles={customStyles}
    
  />
);

function EditButton({ value, setValue, setLoading, canEmpty, isemail, isusername, ispassword, islanguages, islocation, name = "name" }) {
  const [edit, setEdit] = useState(false);
  const [newvalue, setNewValue] = useState(value || "");
  const formRef = useRef(null);
  const [alertPassword, setAlertPassword] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const optionsLocation = countryList().getData();

  useEffect(() => {
    if (ispassword) {
      setNewValue("");
      setAlertPassword(false);
    }else{
      setNewValue(value);
    }

  }, [value, edit]);

  const saveData = (e) => {
    e.preventDefault();
    if (ispassword && !alertPassword) {
      setAlertPassword(true);
      return;
    }
    setLoading(true);
    axios.post(`${import.meta.env.VITE_API_URL}/api/profile`, { [name]: newvalue }, { withCredentials: true })
      .then((res) => {
        setValue(prevState => ({ ...prevState, [name]: newvalue }));
        setEdit(false);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setErrorMessagePassword(err.response.data.JabberMessages);
          setTimeout(() => setErrorMessagePassword(""), 10000);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setEdit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alertPassword]);

  return (
    <>
      {alertPassword && (
        <AlertConfirm
          message="You are about to change your password"
          onClose={() => setEdit(false)}
          onConfirm={saveData}
        />
      )}
      {edit ? (
        <div ref={formRef} className="my-2 relative h-[45px] border border-gray-600 bg-black bg-opacity-10 rounded-lg text-white text-center w-full">
          <form onSubmit={saveData} className="flex items-center h-full px-3 text-start">
            {isemail && <><ion-icon name="mail-outline"></ion-icon><InputField type="email" value={newvalue} onChange={(e) => setNewValue(e.target.value)} /></>}
            {ispassword && <><ion-icon name="lock-closed-outline"></ion-icon><InputField type="password" value={newvalue} onChange={(e) => setNewValue(e.target.value)} minLength={8} placeholder="New password" /></>}
            {islocation && <><ion-icon name="location-outline"></ion-icon><SelectField options={optionsLocation} value={newvalue} onChange={(e) => setNewValue(e.label)} /></>}
            {islanguages && <><ion-icon name="globe-outline"></ion-icon><SelectField options={optionsLanguage} value={newvalue} onChange={(e) => setNewValue(e.value)} /></>}
            {!isemail && !ispassword && !islocation && !islanguages && (
            <><ion-icon name="person-outline" size="small"></ion-icon><InputField type="text" value={newvalue} onChange={(e) => setNewValue(e.target.value)} minLength={4} maxLength={10} /></>
            )}
            <button className="absolute h-full top-0 right-[10%]">
              <ion-icon name="save-outline"></ion-icon>
            </button>
          </form>
        </div>
      ) : (
        <div className="my-2 border border-gray-600 h-[45px] bg-black bg-opacity-10 rounded-lg text-white text-center w-full">
          <button onClick={() => setEdit(true)} className="w-full h-full text-start">
            <p className={`flex items-center p-3 ${value ? "opacity-60" : "opacity-45"}`}>
              {isusername && <><ion-icon name="person-outline" size="small"></ion-icon><span className="px-2">@{value}</span></>}
              {isemail && <><ion-icon name="mail-outline"></ion-icon><span className="px-2">{value || `no ${name} defined`}</span></>}
              {islocation && <><ion-icon name="location-outline"></ion-icon><span className="px-2">{value || `no ${name} defined`}</span></>}
              {ispassword && <><ion-icon name="lock-closed-outline"></ion-icon><span className="px-2">********</span></>}
              {islanguages && <><ion-icon name="globe-outline"></ion-icon><span className="px-2">{value || `no ${name} defined`}</span></>}
              {!isusername && !isemail && !ispassword && !islocation && !islanguages && <><ion-icon name="pencil-outline"></ion-icon><span>{value || `no ${name} defined`}</span></>}
            </p>
          </button>
        </div>
      )}
      {errorMessagePassword && <div className="text-red-500 text-center max-w-[300px]">{errorMessagePassword}</div>}
    </>
  );
}

export default EditButton;
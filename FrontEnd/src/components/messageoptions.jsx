import axios from "axios";
import { useState, useEffect } from "react";

function MessageOptions({ setMessageOptions, messageId, currentContent }) {
  const [content, setContent] = useState("");
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setContent(currentContent);
    setEdit(true);
  };

  const deletemessage = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/messageoptions`, { messageId, option: "delete" }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setMessageOptions(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editmessage = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/messageoptions`, { messageId, option: "edit", content }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setMessageOptions(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="z-40 fixed top-0 backdrop-blur-[1px] left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white flex flex-col w-[200px] rounded-md p-2">
        <button
          className="py-3 text-red-600 "
          onClick={() => {
            setMessageOptions(false);
          }}
        >
          <ion-icon name="close-outline"></ion-icon>
        </button>
        {!edit ? (
          <>
            <button className="p-2 border-t-2" onClick={handleEdit}>
              Edit
            </button>
            <button className="p-2 border-t-2" onClick={deletemessage}>
              Delete
            </button>
          </>
        ) : (
          <>
            <div className="flex size-full">
              <input
                type="text"
                placeholder="Edit message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-1 w-[78%] border-b-2 border-gray-500 text-black"
              />
              <button
                className="py-3 text-green-600 "
                onClick={editmessage}
              >
                <ion-icon name="checkmark-circle-outline"></ion-icon>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageOptions;

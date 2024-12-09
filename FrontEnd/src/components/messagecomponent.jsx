import { useState, useEffect } from "react";
import { format } from "date-fns";
import ModalViewUser from "./ModalViewUser";

function MessageComponent({ messageid, sender, message, time, isMe, userId}) {
  const [viewUser, setViewUser] = useState(false);
  const formattedTime = format(new Date(time), "dd MMMM HH:mm");

  return (
    <>
    {viewUser && <ModalViewUser setViewUser={setViewUser} userId={userId} />}
      <div className={`${isMe ? "me" : "them"} chatmessage  max-w-[70%] flex ${message.length > 10 ? "flex-col" : ""} `}>
        <p className=" break-words px-2">
        {!isMe && (
          <strong className="cursor-pointer" onClick={() => setViewUser(true)}>
            {sender}:{" "}
          </strong>
        )}
          {message}
        </p>
        <span className="text-[9px] opacity-55 text-end flex items-end justify-end">{formattedTime} </span>
      </div>
    </>
  );
}

export default MessageComponent;

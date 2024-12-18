import { useState, useEffect } from "react";
import { format } from "date-fns";
import ModalViewUser from "./ModalViewUser";
import MessageOptions from "./messageoptions";

function MessageComponent({ messageid, sender, message, time, isMe, userId }) {
  const [viewUser, setViewUser] = useState(false);
  const formattedTime = format(new Date(time), "dd MMM HH:mm");
  const [messageoptions, setMessageOptions] = useState(false);

  return (
    <>
    {
      messageoptions && (
        <MessageOptions setMessageOptions={setMessageOptions} messageId={messageid} currentContent={message} />
      )
    }

      {viewUser && <ModalViewUser setViewUser={setViewUser} userId={userId} />}
      <div className={`${isMe ? "me rounded-br-none" : "them rounded-bl-none"} rounded-lg chatmessage p-1  max-w-[70%] flex flex-col  `}>
        <div className="flex justify-between ">
          <p className={` break-words px-2 ${isMe ? "w-[95%]" : ""}`}>
            {!isMe && (
              <strong className="cursor-pointer text-[#f97316]" onClick={() => setViewUser(true)}>
                {sender}:{" "}
              </strong>
            )}
            {message}
          </p>
          {isMe && (
            <div className="w-[20px]">
              <button className="w-full h-[20px]" onClick={() => { setMessageOptions(true)}}>
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </button>
            </div>
          )}
        </div>
        <span className={`text-[9px] px-2 opacity-55 text-end flex items-end ${isMe ? "justify-end" : ""}`}>{formattedTime} </span>
      </div>
    </>
  );
}

export default MessageComponent;

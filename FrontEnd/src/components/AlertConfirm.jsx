import React from "react";

function AlertConfirm({ onClose, onConfirm, title, message }) {
  return (
    <div className="size-full fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75">
      <div className="size-full flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl flex justify-center items-center flex-col ">
          <div className="text-slate-600 text-lg font-semibold mb-3"> ¿Are you sure?</div>
            <div className="text-slate-600 text-sm font-normal">{message}</div>
            <div className="flex justify-center items-center w-[80%] mt-4">
              <button
                className=" bg-green-500 w-1/2 p-2 rounded-xl mr-2"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                className="bg-red-500 w-1/2 p-2 rounded-xl ml-2"
                onClick={() => {
                  onClose();
                }}
              >
                No
              </button>
              </div>
        </div>
      </div>
    </div>
  );
}

export default AlertConfirm;

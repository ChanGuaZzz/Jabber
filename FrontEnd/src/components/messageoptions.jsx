function MessageOptions({setMessageOptions, messageId}) {
    
    


  return (
    <div className="z-40 fixed top-0 backdrop-blur-[1px] left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white flex flex-col w-[200px] rounded-md p-2">
      <button className="p-2 text-red-600 " onClick={() => {setMessageOptions(false)}}>
        <ion-icon name="close-outline"></ion-icon>
      </button>
      <button className="p-2 border-t-2">Edit</button>
      <button className="p-2 border-t-2">Delete</button>
    </div>
  </div >
  );
}

export default MessageOptions;
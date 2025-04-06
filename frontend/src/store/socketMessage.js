"use client"
import { useEffect, useState } from "react";
import useConversation from "./useConversation";
import useSocketStore from "./socketStore";

const sound = "/notification.mp3";

const useGetSocketMessage = () => {
  // Socket state ko access kar rahe hain
  const socket = useSocketStore((state) => state.socket);
  // New message ko store karne ka function (useConversation se aa raha hai)
  const { addNewMessage } = useConversation();
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // User ne page pe click ya key press kiya toh `isUserInteracted` true ho jayega
  useEffect(() => {
    const enableAudio = () => setIsUserInteracted(true);
  //Click ya key press hone par audio enable ho sakti hai
    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);

    return () => {
      //Jab component unmount hoga toh listeners hata denge
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, []);

  useEffect(() => {
    if (!socket) return; // Agar socket available nahi hai toh kuch mat karo

    const handleNewMessage = (newMessage) => {
      // Agar user interact kar chuka hai toh notification sound bajegi
      if (isUserInteracted) {
        const notification = new Audio(sound);
        notification.play().catch((error) => console.error("Audio play failed:", error));
      }
      //Naye message ko UI me add kar rahe hain
      addNewMessage(newMessage);
    };
    // Jab "newMessage" event aaye toh `handleNewMessage` function call hoga
    socket.on("newMessage", handleNewMessage);
     //ye bhi cleanup function hai 
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, addNewMessage, isUserInteracted]);
};

export default useGetSocketMessage;

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import io from "socket.io-client";
import userStore from "./userStore";

const useSocketStore = create(
  persist(
    (set, get) => ({
      socket: null,  // Jab tak socket initialize nahi hota, tab tak null hai
      onlineUsers: [], // Online users ki list shuru me khali hai

      initializeSocket: () => {
        const user = userStore.getState().user;
        if (!user || !user._id || get().socket) return;// Agar socket already bana hai toh naye connection se rok do
        //get().socket ka use karke check kar raha hai ki pehle se koi socket connection bana hai ya nahi.
        //Agar socket hai toh kuch nahi karega (return karega), taaki multiple connections na bane.
        const newSocket = io("http://localhost:8080", {
          query: { userId: user._id },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
         //Socket.IO ka client bana raha hai jo http://localhost:8080 server se connect hoga.

        //Query parameters me userId bhej raha hai, taaki server ko pata chale kaun connect ho raha hai.

        newSocket.on("getOnlineUsers", (users) => {
          set({ onlineUsers: users });
        });

        set({ socket: newSocket }); // Do NOT persist this
      },
       //Server se ek event getOnlineUsers sun rahi hai.

      //Jab bhi server se online users ka data aata hai, toh state update kar rahi hai.

      //set({ onlineUsers: users }) ka matlab hai:

      //Online users ki list ko update kar do.

      //Jo bhi naye users online aaye ya chale gaye, woh UI me reflect hoga.

      closeSocket: () => {
        get().socket?.close();
        set({ socket: null, onlineUsers: [] });
      },
    }),
    {
      name: "socket-storage",
      storage: createJSONStorage(() => localStorage), // Ye persist ko batata hai ki localStorage use karna hai, but sab kuch store nahi karna hai.
      partialize: (state) => ({ onlineUsers: state.onlineUsers }),// Ye state me se sirf onlineUsers ko save karega, socket ko ignore karega
    }
  )
);
if (userStore.getState().user) {
  useSocketStore.getState().initializeSocket();
}

export default useSocketStore;

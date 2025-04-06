"use client"
import useSocketStore from "@/store/socketStore";
import HomePage from "./Home/HomePage";
import { useEffect } from "react";

export default function Home() {
   const initializeSocket=useSocketStore((state)=>state.initializeSocket);

   useEffect(()=>{
      initializeSocket();
   },[]);

  return (

     <div>
        <HomePage/>
     </div>

  );
}


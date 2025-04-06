import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Phone, VideoIcon } from "lucide-react";
import useSocketStore from "@/store/socketStore";

const ChattingUserHeader = ({ user }) => {
  const { socket, onlineUsers } = useSocketStore();
  const isOnline = onlineUsers.includes(user?._id); 
  console.log(`User: ${"from profile header",user.username}, Online: ${isOnline}`);


  if (!user) {
    return (
      <Card className="flex h-[70px] w-full dark:bg-slate-800/40 bg-white shadow-md rounded-md justify-center items-center sticky top-16">
        <span className="text-gray-500 dark:text-gray-300">No user selected</span>
      </Card>
    );
  }

  return (
    <Card className="flex h-[70px] w-full dark:bg-slate-800/40 bg-white shadow-md rounded-md justify-between px-4 py-2 items-center sticky top-16">
      {/* User Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
          <AvatarImage src={user.profilePicture } alt={user.username} />
          <AvatarFallback className="text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-600 text-lg font-semibold">
            {user.username ? user.username
              .split(" ")
              .filter(Boolean)
              .map((word) => word[0])
              .join("")
              .toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        {/* Name & Status */}
        <div className="flex flex-col">
          <span className="text-md font-medium text-gray-900 dark:text-white">
            {user.username || "Unknown"}
          </span>
          <div className="flex items-center space-x-2">
            {/* Status Indicator */}
            <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-700/30 hover:bg-blue-200 dark:hover:bg-blue-600 transition">
          <VideoIcon size={22} className="text-blue-500 dark:text-blue-400" />
        </button>
        <button className="p-2 rounded-full bg-green-100 dark:bg-green-700/30 hover:bg-green-200 dark:hover:bg-green-600 transition">
          <Phone size={22} className="text-green-500 dark:text-green-400" />
        </button>
      </div>
    </Card>
  );
};

export default ChattingUserHeader;

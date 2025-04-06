"use client"
import { formatData } from "@/lib/utils";
import { MoreVertical, Trash, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useConversation from "@/store/useConversation";
import userStore from "@/store/userStore";
import { useEffect, useRef } from "react";

const ChatArea = ({ messages, selectedUser }) => {
  const lastMsgRef = useRef(null);
  const { deleteForMe, deleteForEveryone } = useConversation();
  const { user } = userStore();
  const loggedInUserId = user?.id || user?._id || null;

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const handleDeleteForMe = (loggedInUserId, messageId) => {
    deleteForMe(loggedInUserId, messageId);
  };

  const handleDeleteForEveryone = (senderId, messageId) => {
    deleteForEveryone(senderId, messageId);
  };

  return (
    <div className="p-4 overflow-y-scroll no-scrollbar flex flex-col h-full">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => {
          const isSender = selectedUser ? msg.senderId !== selectedUser._id : false;

          return (
            <div
              key={msg._id}
              ref={index === messages.length - 1 ? lastMsgRef : null}
              className={`flex flex-col ${isSender ? "items-end" : "items-start"} my-2 px-6 w-full relative group`}
            >
              <div
                className={`relative cursor-pointer p-3 text-sm shadow-md max-w-[75%]
                ${isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}
                rounded-lg ${isSender ? "rounded-br-none" : "rounded-bl-none"}`}
              >
                <p>{msg.message}</p>
                <div
                  className={`absolute bottom-0 w-4 h-4 
                    ${isSender ? "-right-1 bg-blue-500 rotate-45" : "-left-1 bg-gray-200 dark:bg-gray-700 rotate-45"}`}
                ></div>
              </div>

              <div
                className={`absolute ${isSender ? "right-2" : "left-32"} top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <MoreVertical
                        size={18}
                        className="bg-stone-500 rounded-full h-[20px] w-[20px] p-1 text-gray-200 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-200"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isSender ? "end" : "start"}>
                    <DropdownMenuItem
                      onClick={() => handleDeleteForMe(loggedInUserId, msg._id)}
                      className="cursor-pointer"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete for me</span>
                    </DropdownMenuItem>
                    {isSender && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteForEveryone(msg.senderId, msg._id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete for everyone</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <span className={`text-xs mt-1 opacity-70 ${isSender ? "text-right pr-1" : "text-left pl-1"}`}>
                {formatData(msg?.createdAt)}
              </span>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 h-full">
          <img src="/gif.gif" className="h-[350px] w-auto rounded-xl mb-4" alt="No messages" />
          <p className="text-lg font-semibold text-slate-900 dark:text-gray-400 animate-pulse">
            Start your conversation now!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

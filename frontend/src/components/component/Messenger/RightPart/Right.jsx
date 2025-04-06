import React, { useEffect } from "react";
import SendMessageBar from "./component/SendMessageBar";
import ChatArea from "./component/ChatArea";
import ChattingUserHeader from "./component/ChattingUserHeader";
import useConversation from "@/store/useConversation";
import useGetSocketMessage from "@/store/socketMessage";


const Right = ({ selectedUser }) => {
  const { fetchMessages, messages } = useConversation();
  
  useGetSocketMessage(); // Call the hook here to receive real-time messages

  useEffect(() => {
    (async () => {
      if (selectedUser?._id) {
        await fetchMessages(selectedUser._id);
      }
    })();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white flex flex-col items-center justify-center h-full">
        <img src="/gif.gif" className="h-[350px] w-auto rounded-xl mb-4" />
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white flex flex-col justify-between h-full">
      <div>
        <ChattingUserHeader user={selectedUser} />
        <div className="max-h-[70vh] flex-1 overflow-y-scroll no-scrollbar scroll-smooth">
          <ChatArea messages={messages} selectedUser={selectedUser} />
        </div>
      </div>
      <div className="bottom-0 sticky">
        <SendMessageBar receiverId={selectedUser._id} />
      </div>
    </div>
  );
};

export default Right;

"use client";
import { ImageIcon, Send, Smile } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import useConversation from "@/store/useConversation";

const SendMessageBar = ({ receiverId }) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const { sendNewMessage } = useConversation(); 

  const getTheme = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

  const handleFileExploral = () => {
    fileInputRef.current.click();
  };

  const handleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    if (isEmojiPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPickerOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
  
    if (!receiverId) {
      console.error("Error: receiverId is missing!");
      return;
    }
  
    console.log("Sending message to:", receiverId, "Message:", message);
  
    await sendNewMessage(receiverId, message);
    setMessage(""); 
  };
  

  return (
    <div className="relative">
      <div className="w-full p-4 h-[64px] border flex items-center gap-3 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-lg rounded-lg sticky bottom-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="w-full p-2 pr-12 border rounded-lg outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700"
          />
          {/* Send Button inside Input */}
          <button
            onClick={handleSendMessage}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-1 transition"
          >
            <Send size={18} />
          </button>
        </div>

        <button
          onClick={handleFileExploral}
          className="w-10 h-10 flex items-center justify-center bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full hover:bg-emerald-500/30 transition"
        >
          <ImageIcon size={22} className="text-emerald-500" />
        </button>

        <button
          onClick={handleEmojiPicker}
          className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full hover:bg-yellow-500/30 transition"
        >
          <Smile size={22} className="text-yellow-500" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
        />
      </div>

      {isEmojiPickerOpen && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-[80px] right-8  z-10"
        >
          <EmojiPicker onEmojiClick={onEmojiClick} theme={getTheme()} />
        </div>
      )}
    </div>
  );
};

export default SendMessageBar;



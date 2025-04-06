import { deleteForEveryOne, deleteForMe, getMessages, sendMessage } from "@/service/message.service";
import { create } from "zustand";

const useConversation = create((set, get) => ({
  messages: [],
  loading: false,

  fetchMessages: async (chatUserId) => {
    if (!chatUserId) return;
    set({ loading: true });

    try {
      const messages = await getMessages(chatUserId);
      set({ messages: messages.data, loading: false });
    } catch (error) {
      console.error("Error in fetching messages:", error);
      set({ messages: [], loading: false });
    }
  },

  sendNewMessage: async (receiverId, message) => {
    try {
      const newMessage = await sendMessage(receiverId, message);
      
      if (newMessage?.data) {
        set((state) => ({ messages: [...state.messages, newMessage.data] }));
      } else {
        console.error("Error: Message response is invalid", newMessage);
      }
    } catch (error) {
      console.error("Error in sending message:", error);
    }
  },

  
  addNewMessage: (newMessage) => {
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  
  deleteForMe: async (userId, messageId) => {
    try {
      await deleteForMe(userId, messageId);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error("Error in deleting message for me:", error);
    }
  },

  deleteForEveryone: async (senderId, messageId) => {
    try {
      await deleteForEveryOne(senderId, messageId);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error("Error in deleting message for everyone:", error);
    }
  },
}));

export default useConversation;

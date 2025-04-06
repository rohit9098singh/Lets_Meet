import axiosInstance from "./url.service";

export const sendMessage = async (receiverId, message) => {
  try {
    const response = await axiosInstance.post(
      `/api/message/send/${receiverId}`,
      { message }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const getMessages = async (chatUserId) => {
  try {
    const response = await axiosInstance.get(`/api/message/get/${chatUserId}`);
    console.log("get message", response);
    return response.data;
  } catch (error) {
    console.error("Error retrieving messages:", error);
  }
};

export const deleteForMe = async (userId, messageId) => {
  try {
    const response = await axiosInstance.post(`/api/message/deleteForMe`, {
      userId,
      messageId,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting message for me:", error);
  }
};
export const deleteForEveryOne = async (senderId, messageId) => {
  try {
    const response = await axiosInstance.post(
      `/api/message/deleteForEveryone`,
      { senderId, messageId }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting message for everyone:", error);
  }
};

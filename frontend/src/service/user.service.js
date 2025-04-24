import axiosInstance from "./url.service";

export const getAllFriendRequest = async () => {
    try {
        const response = await axiosInstance.get("/api/users/friend-request");
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllFriendSuggestion = async () => {
    try {
        const response = await axiosInstance.get("/api/users/users-to-request");
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const followUser = async (userId) => {
    try {
        const response = await axiosInstance.post("/api/users/follow", { userIdToFollow: userId });
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const unfollowUser=async(userId)=>{
  try {
    const response = await axiosInstance.post("/api/users/unfollow", { userIdToUnFollow: userId });
    return response?.data;
} catch (error) {
    console.error(error);
    throw error;
}
}

export const deleteUserFromRequest = async (userId) => {
    try {
        const response = await axiosInstance.post("/api/users/remove/friend-request", { requestSenderId: userId });
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchUserProfile = async (userId) => {
    if (!userId) {
        console.error(" User ID is missing in fetchUserProfile!");
        return null; // Prevent making the request
    }
    try {
        const response = await axiosInstance.get(`/api/users/profile/${userId}`);
        return response?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};




export const getMutualFriends = async () => {
    try {
        const response = await axiosInstance.get(`/api/users/mutual-friends`);
        return response?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserProfile = async (userId, updateData) => {
    try {
        const response = await axiosInstance.put(`/api/users/profile/${userId}`, updateData);
        return response?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserCoverPhoto = async (userId, updateData) => {
    try {
        const response = await axiosInstance.put(`/api/users/profile/cover-photo/${userId}`, updateData);
        return response?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createOrUpdateBio = async (userId, updateData) => {
    try {
        const response = await axiosInstance.put(`/api/users/bio/${userId}`, updateData);
        return response?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllUsers=async(searchQuery="")=>{
    try {
        const response = await axiosInstance.get(`/api/users/all-users?search=${searchQuery}`);
        return response?.data?.users || []
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchRegisteredUser=async()=>{
    try {
        const response=await axiosInstance.get(`api/users/registered-users`);
        return response?.data || []
    } catch (error) {
        console.error(error);
        throw error;
    }
}

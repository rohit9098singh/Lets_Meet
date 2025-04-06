import axiosInstance from "./url.service";

// post karna or nikalne ka method
export const createPost = async (postData) => {
  try {
    const result = await axiosInstance.post("/api/users/posts", postData);
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePost=async(postId)=>{
  try {
      const result=await axiosInstance.delete(`api/users/posts/${postId}`)
      return result?.data
  } catch (error) {
      console.log(error);
      throw error
  }
}

export const getAllPost = async () => {
  try {
    const result = await axiosInstance.get("/api/users/posts");
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// story laganae ka method
export const createStory = async (postData) => {
  try {
    const result = await axiosInstance.post("/api/users/story", postData);
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllStoryMethod = async () => {
  try {
    const result = await axiosInstance.get("/api/users/story");
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// likes ka api fetch
export const likePost = async (postId) => {
  try {
    const result = await axiosInstance.post(`/api/users/posts/likes/${postId}`);
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// comment ka api fetch
export const commentsPost = async (postId, comment) => {
  try {
    const result = await axiosInstance.post(
      `/api/users/posts/comments/${postId}`,
      comment
    );
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// share ka api fetch
export const sharePost = async (postId) => {
  try {
    const result = await axiosInstance.post(`/api/users/posts/share/${postId}`);
    return result?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get all user posts

export const getAllUsersPostById = async (userId) => {
  try {
    const result = await axiosInstance.get(`api/users/posts/user/${userId}`);
    return result?.data?.data
  } catch (error) {
    console.log(error);
    throw error;
  }
};

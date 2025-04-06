import axiosInstance from "./url.service";

//signup user ke time ye chalega
export const registerUser = async (userData) => {
  try {
    console.log(userData);
    
    const response = await axiosInstance.post("/api/auth/register", userData);
        return response.data;
  } catch (error) {
    console.log(error);
  }
};

// login user ke liye
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", userData);
        return response.data;
  } catch (error) {
    console.log(error);
  }
};

// for logout functionlity
export const logoutUser = async (userData) => {
  try {
    const response = await axiosInstance.get("/api/auth/logout",userData);
      return response.data;
  } catch (error) {
    console.log(error);
  }
};

// check auth to redirect to the home page

export const checkUserAuth = async () => {
    try {
      const response = await axiosInstance.get("api/users/check-auth");
      if (response.data.status === "success") {
        return { isAuthenticated: true, user: response?.data?.data };
      }
      else if(response.data.status === "error") {
       return {isAuthenticated: false, user: null}
      }
    } catch (error) {
      console.log("Authentication check failed:", error);
      return { isAuthenticated: false, user: null }; 
    }
  };
  
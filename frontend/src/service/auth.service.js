import axiosInstance from "./url.service";

//signup user ke time ye chalega
export const registerUser = async (userData) => {
  try {
    console.log(userData);
    
    const response = await axiosInstance.post("/api/auth/register", userData);
    // Store token in localStorage if registration is successful
    if (response.data.status === "success" && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// login user ke liye
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", userData);
    console.log("Login response data:", response.data);
    // Store token in localStorage if login is successful
    if (response.data.status === "success" && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return null; // Ensure caller doesn't get undefined
  }
};

// for logout functionlity
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/logout");
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    return response.data;
  } catch (error) {
    console.log(error);
    // Clear token from localStorage even if logout fails
    localStorage.removeItem('auth_token');
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
      // Clear token if authentication check fails
      localStorage.removeItem('auth_token');
      return { isAuthenticated: false, user: null }; 
    }
  };

// Helper function to get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Helper function to clear token from localStorage
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
  
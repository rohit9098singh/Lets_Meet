
import {
  deleteUserFromRequest,
  followUser,
  getAllFriendRequest,
  getAllFriendSuggestion,
  getMutualFriends,
  unfollowUser,
} from "@/service/user.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const userFriendStore = create((set, get) => ({
  friendRequest: [],
  friendSuggestion: [],
  mutualFriends: [],
  loading: false,
  isLoading: false,

  // Fetch Friend Requests
  fetchFriendRequest: async () => {
    set({ isLoading: true });
    try {
      const response = await getAllFriendRequest();
      set({ friendRequest: response?.data || [] }); // Ensure fallback to empty array
    } catch (error) {
      set({ friendRequest: [] }); // Reset to empty array on failure
      toast.error("Failed to fetch friend requests");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch Friend Suggestions
  fetchFriendSuggestion: async () => {
    set({ isLoading: true });
    try {
      const response = await getAllFriendSuggestion();
      set({ friendSuggestion: response.data });
    } catch (error) {
      set({ error });
      toast.error("Failed to fetch friend suggestions");
    } finally {
      set({ isLoading: false });
    }
  }, 

  // Fetch Mutual Friends
  fetchMutualFriends: async () => {
    set({ isLoading: true });
    try {
      const response = await getMutualFriends();
      set({ mutualFriends: response });
    } catch (error) {
      set({ error });
      toast.error("Failed to fetch mutual friends");
    } finally {
      set({ isLoading: false });
    }
  },

  // Follow User
  followUser: async (userId) => {
    set({ isLoading: true });
    try {
      await followUser(userId);
      // toast.success("Followed user successfully");
    } catch (error) {
      set({ error });
      // toast.error("Failed to follow user");
    } finally {
      set({ isLoading: false });
    }
  },

  // Unfollow User
  unFollowUser: async (userId) => {
    set({ isLoading: true });
    try {
      await unfollowUser(userId);
      toast.success("Unfollowed user successfully");
    } catch (error) {
      set({ error });
      toast.error("Failed to unfollow user");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete Friend Request
  deleteUserRequest: async (userId) => {
    set({ isLoading: true });
    try {
      await deleteUserFromRequest(userId);
      // toast.success("Friend request deleted successfully");
    } catch (error) {
      set({ error });
      // toast.error("Failed to delete friend request");
    } finally {
      set({ isLoading: false });
    }
  },
}));

import {
  createPost,
  getAllPost,
  getAllUsersPostById,
  createStory,
  getAllStoryMethod,
  likePost,
  sharePost,
  commentsPost,
  deletePost
} from "@/service/post.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  userPosts: [],
  story: [],
  loading: false,
  error: null, 

  // Fetch all posts
  fetchPost: async () => {
    set({ loading: true });
    try {
      const post = await getAllPost();
      set({ posts: post, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  handleDeletePost: async (postId) => {
    set({ loading: true });
    try {
      await deletePost(postId);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId), 
        loading: false,
      }));
      toast.success("Post deleted successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("you are not the owner to delete this post");
    }
  },

  // Fetch user posts by ID
  fetchUserPost: async (userId) => {
    set({ loading: true });
    try {
      const userPost = await getAllUsersPostById(userId);
      set({ userPosts: userPost, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // Fetch all stories
  // Create a new post
  handleCreatePost: async (postData) => {
    set({ loading: true });
    try {
      const newPost = await createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts], // Append new post
        loading: false,
      }));
      toast.success("Post created successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("Failed to create your post");
    }
  },

  fetchStoryPosts: async () => {
    set({ loading: true });
    try {
      const story = await getAllStoryMethod();
      set({ story: story, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },


  // Create a new story
  handleCreateStory: async (storyData) => {
    set({ loading: true });
    try {
      const storyPost = await createStory(storyData);
      set((state) => ({
        story: state.story ? [storyPost, ...state.story] : [storyPost],
        loading: false,
      }));  
      toast.success("Story created successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("Failed to create your story");
    }
  },

  //
  handleLikePost: async (postId) => {
    set({ loading: true });
    try {
      await likePost(postId);
    } catch (error) {
      set({ error, loading: false });
    }
  },

  handleCommentPost: async (postId, text) => {
    set({ loading: true });
    try {
      const newComment = await commentsPost(postId, { text }); 
      set((state) => ({                   
        posts: state.posts.map((post) =>  
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] } 
            : post
        ),
        loading: false,
      }));
      toast.success("Comment added successfully");
    } catch (error) {
      console.log(error)
      set({ error, loading: false });
      toast.error("Failed to add comment");
    }
  },

  handleSharePost: async (postId) => {
    set({ loading: true });
    try {
      await sharePost(postId);
      toast.success("Your post has been shared successfuly")
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to share this error")
    }
  }, 
}));

"use client";
import LeftSidebar from "@/components/component/LeftSideBar/LeftSideBar";
import React, { useEffect } from "react";
import NoFirendMessage from "./components/NoFirendMessage";
import FriendRequest from "./FriendRequest/FriendRequest";
import FriendSuggestion from "./FriendSuggestion/FriendSuggestion";
import {
  FriendRequestSkeleton,
  FriendSuggestionSkeleton,
} from "./components/Skeleton";
import { userFriendStore } from "@/store/userFriendStore";
import toast from "react-hot-toast";

const Page = () => {
  const { 
    followUser, 
    isLoading, 
    fetchFriendRequest, 
    fetchFriendSuggestion, 
    deleteUserRequest, 
    fetchMutualFriends, 
    friendRequest, 
    friendSuggestion, 
    mutualFriends 
  } = userFriendStore();
  

   useEffect(() => {
       fetchFriendRequest(),
       fetchFriendSuggestion()
   },[fetchFriendRequest,fetchFriendSuggestion])
   
   const handleAction = async(action,userId) =>{
    if(action === "confirm"){
       toast.success("friend added successfully")
        await followUser(userId);
        fetchFriendRequest()
        fetchFriendSuggestion()
    } else if(action ==="delete"){
      toast.success("friend Request Removed")
      await deleteUserRequest(userId);
      fetchFriendRequest()
      fetchFriendSuggestion()
    } 
   }

  console.log("friend request",friendRequest);
  console.log("friend suggestion",friendSuggestion)
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      <div className="ml-0 lg:ml-64 mt-16 p-6">
        {/* Friend Requests Section */}
        <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <FriendRequestSkeleton />
          ) : friendRequest.length === 0 ? (
            <NoFirendMessage
              text="No Friend Requests"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendRequest.map((friend,index) => (
              <FriendRequest key={index} friend={friend} loading={isLoading} onAction={handleAction}/>
            ))
          )}
        </div>

        {/* Friend Suggestions Section */}
        <h1 className="text-2xl font-bold mt-10 mb-6">Friend Suggestions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <FriendSuggestionSkeleton />
          ) : friendSuggestion.length === 0 ? (
            <NoFirendMessage
              text="No Friend Suggestions"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendSuggestion.map((friend,index) => (
              <FriendSuggestion key={index} friend={friend} loading={isLoading} onAction={handleAction}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

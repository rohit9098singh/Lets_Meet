"use client"; // Yeh next.js ka client component banata hai
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import userStore from "@/store/userStore"; // User data ke liye global store
import { Plus } from "lucide-react"; // Plus icon ke liye
import React, { useRef, useState } from "react";
import StoryPreview from "./StoryPreview"; // Story preview ke liye component
import { usePostStore } from "@/store/usePostStore";

const StoryCard = ({ isAddStory, story }) => {
  const { user } = userStore();
  const { handleCreateStory, fetchStoryPosts } = usePostStore();

  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);
  const [successPost, setSuccessPost] = useState(false);

  // File select karne ke liye ref
  const fileInputRef = useRef(null);

  // User ke initials banane ke liye (Jaise "Rohit Sharma" ka "RS")
  const userPlaceholder =
    user?.username
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "You";

  // File select hone par state update karna
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.startsWith("video") ? "video" : "image");
      setFilePreview(URL.createObjectURL(file));
      setIsNewStory(true);
      setShowPreview(true);
    }
    e.target.value ="";
  };

  // Story ko upload karne ka function
  const handleCreateStoryPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      await handleCreateStory(formData);
      await fetchStoryPosts();
      resetStoryState();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  // Story par click hone par preview dikhana
  const handleStoryClick = () => {
    if (!story?.mediaUrl) return;
    setFilePreview(story?.mediaUrl);
    setFileType(story?.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  };

  // State ko reset karna
  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
  };

  return (
    <>
      <Card
        className="h-52 w-40 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={!isAddStory ? handleStoryClick : undefined}
      >
        <CardContent className="p-0 h-full">
          {isAddStory ? (
            // Naya story add karne ka UI
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="h-3/4 w-full relative border-b overflow-hidden rounded-b-xl">
                {/* Avatar dikhana */}
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="object-cover"
                    />
                  ) : (
                    <p className="w-full h-full flex justify-center items-center text-4xl  bg-gray-400 text-white">
                      {userPlaceholder} 
                    </p>
                  )}
                </Avatar>
              </div>
              {/* Add Story Button */}
              <div className="w-full h-1/4 bg-white dark:bg-gray-800 flex flex-col justify-center items-center">
                <Button
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="p-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1 dark:text-white">
                  Create Story
                </p>
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            // Agar add story nahi hai toh existing story dikhao
            <div className="relative h-full w-full">
              {story?.mediaType === "image" ? (
                <img
                  src={story?.mediaUrl || ""}
                  alt={story?.user?.username || "Story"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={story?.mediaUrl || ""}
                  className="h-full w-full object-cover"
                  controls
                />
              )}
              {/* Story ke avatar aur username dikhana */}
              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full">
                <Avatar className="h-8 w-8">
                  {story?.user?.profilePicture ? (
                    <AvatarImage
                      src={story?.user.profilePicture}
                      alt={story?.user?.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-400">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs truncate">
                  {story?.user?.username || "Unknown"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Preview Component */}
      {showPreview && (
        <StoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleCreateStoryPost}
          isNewStory={isNewStory}
          username={isNewStory ? user?.username : story?.user?.username}
          avatar={
            isNewStory ? user?.profilePicture : story?.user?.profilePicture
          }
          isLoading={loading}
        />
      )}
    </>
  );
};
export default StoryCard;

{
  /**
    1st Check - isAddStory
    Agar isAddStory true hai, toh handleStoryClick nahi chalega (kyunki ye naya story create karne ka UI hai).
Agar isAddStory false hai, tab handleStoryClick chalega jo story preview dikhayega.



2nd Agar isAddStory true hai, toh "Create Story" ka UI dikhega (Plus button, Avatar, File Input, etc.).
Agar isAddStory false hai, toh jo existing story hai wo dikhayega (image ya video).
*/
}

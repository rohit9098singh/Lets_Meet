"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ImageIcon, Smile, Upload, Video, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import userStore from "@/store/userStore";
import { usePostStore } from "@/store/usePostStore";
import { AnimatePresence } from "framer-motion";
import { DialogDescription } from "@radix-ui/react-dialog";

const NewPostForm = ({ isPostFormOpen, setIsPostFormOpen }) => {
  // State variables
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // User data
  const { user } = userStore();
  console.log("this is the user going ",user)
  // console.log("from new postform ",user)
  const { handleCreatePost } = usePostStore();
  const userPlaceholder = user?.username
    ?.split(" ")
    .filter(Boolean) // Remove extra spaces
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setFileType(file.type.startsWith("image"));
    setFilePreview(URL.createObjectURL(file));
  };

  // Handle post submission
  const handlePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", postContent);
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      const result = await handleCreatePost(formData);
      console.log("this is the data u are sending   newform line 64", result);
      setPostContent("");
      setFilePreview(null);
      setSelectedFile(null);
      setIsPostFormOpen(false);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitSuccess(false);
      console.error("!Error posting:", error);
    } finally {
      setLoading(false);
      setSubmitSuccess(false);
    }
  };

  // Toggle emoji picker
  const handleEmojiClick = (emojiObject) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  

  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex space-x-4 pt-2 ">
            <Avatar>
              {user?.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback className="bg-gray-400">
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>
            <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
              <div className="flex flex-col gap-2 w-full">
                <DialogTrigger className="w-full">
                  <Input
                    placeholder={`What's on your mind?${" "}${user?.username}`}
                    readOnly
                    className="cursor-pointer rounded-full h-12 dark:bg-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <hr className="my-2 border-t border-slate-800 dark:border-white" />
                  <div className="flex justify-between">
                    <span
                      className="flex items-center justify-center dark:hover:bg-gray-900"
                    >
                      <ImageIcon size={16} className="h-5 w-5 text-green-500 mr-2" />
                      <span className="hidden md:block dark:text-white">
                        Photo
                      </span>
                    </span>
                    <span
                      className="flex items-center justify-center dark:hover:bg-gray-900"
                    >
                      <Video size={16} className="h-5 w-5 text-green-500 mr-2" />
                      <span className="hidden md:block dark:text-white">
                        Videos
                      </span>
                    </span>
                    <span
                      className="flex items-center justify-center dark:hover:bg-gray-900"
                    >
                      <Smile size={16} className="h-5 w-5 text-green-500 mr-2" />
                      <span className=" hidden md:block dark:text-white">
                        Feelings
                      </span>
                    </span>
                  </div>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[500px] max-h-[70vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-center">Create Post</DialogTitle>
                  <DialogDescription className="text-center">Follow Below</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-3 ">
                  <Avatar>
                    {user?.profilePicture ? (
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user?.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-400">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="font-semibold dark:text-white">
                    {user?.username}
                  </p>
                </div>
                <hr className=" border-t border-slate-800 dark:border-white" />
                <Textarea
                  placeholder={`What's on your mind,?${user?.username}`}
                  className="min-h-[100px] text-lg"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <AnimatePresence>
                  {(showImageUpload || filePreview) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative border-2 border-dashed border-gray-400 flex flex-col justify-center items-center h-auto p-10 space-y-2 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {filePreview ? (
                        <div className="w-full flex justify-center">
                          {fileType ? (
                            <img
                              src={filePreview || "/placeholder.svg"}
                              alt="Selected file"
                              className="max-h-40 rounded-lg"
                            />
                          ) : (
                            <video
                              src={filePreview}
                              className="max-h-40 rounded-lg"
                              controls
                            ></video>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="text-gray-500" size={24} />
                          <p className="text-gray-500">Upload images/videos</p>
                        </div>
                      )}
                      {filePreview && (
                        <div
                          className="absolute dark:bg-white bg-gray-900/50 rounded-full p-1 top-2 right-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowImageUpload(false);
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                        >
                          <X
                            size={18}
                            className="text-white dark:text-black font-bold"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 dark:bg-transparent border border-gray-600 min-h-16 rounded-lg p-4 relative">
                  <button className="bg-emerald-500/10 rounded-full py-1 px-2">
                    <ImageIcon
                      size={20}
                      className="text-emerald-400 dark:text-emerald-400"
                      onClick={() => {
                        setShowImageUpload(true);
                        // fileInputRef.current.click();
                      }}
                    />
                  </button>
                  <button className="bg-red-500/10 rounded-full py-1 px-2">
                    <Video
                      size={20}
                      className="text-red-400"
                      onClick={() => {
                        setShowImageUpload(true);
                        // fileInputRef.current.click();
                      }}
                    />
                  </button>
                  <DropdownMenu
                    open={isEmojiPickerOpen}
                    onOpenChange={setIsEmojiPickerOpen}
                  >
                    <DropdownMenuTrigger>
                      <p className="bg-yellow-500/10 rounded-full p-2">
                        <Smile size={20} className="text-yellow-400" />
                      </p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      align="center"
                      sideOffset={5}
                      className=" bg-gray-800 p-2 rounded-lg absolute  bottom-0"
                    >
                      <EmojiPicker
                        lazyLoadEmojis
                        theme="dark"
                        onEmojiClick={handleEmojiClick}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 h-12 text-md font-bold w-full"
                  onClick={handlePost}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </div>
                  ) : submitSuccess ? (
                    <div className="flex items-center gap-2">
                      <CardCheckCircl className="h-5 w-5" />
                      Successfully Posted!
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      Post
                      <ArrowRight
                      size={24} className="group-hover:translate-x-1 transition-transform animate-bounce duration-1000 font-bold text-black" />
                    </div>
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPostForm;

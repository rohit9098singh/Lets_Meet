"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, MessageCircle, Send, Share2, ThumbsUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import VideoComments from "./VideoComments";
import { Input } from "@/components/ui/input";
import userStore from "@/store/userStore";
import { formatData } from "@/lib/utils";

const VideoCard = ({ post, isLiked, onShare, onComments, onLike }) => {
  // console.log(post);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const commentRef = useRef(null);
  const { user } = userStore();

  const userPostPlaceholder = user?.username
    ?.split(" ") // Split into words
    .filter(Boolean) // Remove extra spaces
    .map((word) => word[0]) // Take the first letter of each word
    .join("")
    .toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    }

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComment]);

  const generateSharableLink = () => {
    return `https://localhost:3000/${post?.id}`;
  };

  const handleShare = (platform) => {
    let shareUrl = "";
    const url = generateSharableLink();

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareModalOpen(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: "#1877F2",
      Instagram: "#E1306C",
      LinkedIn: "#0077B5",
      Copy: "#1DA1F2",
    };
    return colors[platform] || "#555";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className=" dark:bg-[#0f0f0f]/80 rounded-md bg-white p-4 shadow drop-shadow"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            {post?.user?.profilePicture ? (
              <AvatarImage
                src={post?.user?.profilePicture}
                alt={post?.user?.username}
              />
            ) : (
              <AvatarFallback className="bg-gray-400">
                {userPostPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <p className="text-xs font-medium">{post?.user?.username}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <Clock size={14} />
          <p>{formatData(post?.createdAt)}</p>
        </div>
      </div>

      {/* Video Content */}
      <div className="dark:bg-slate-900  bg-black aspect-video  rounded-md  ">
        {post?.mediaUrl && (
          <video controls className="w-full max-h-[400px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-cover rounded-lg mb-4">
            <source src={post?.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag
          </video>
        )}
      </div>

      {/* Like, Comment & Share Section */}
      <div className="flex flex-col mx-4 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-semibold">
            {post.likeCount} Likes
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p
              onClick={() => setShowComment(!showComment)}
              className="text-gray-600 font-semibold cursor-pointer"
            >
              {post?.commentCount || 0} comments
            </p>
            <p className="text-gray-600 font-semibold">
              {" "}
              {post.shareCount} shares
            </p>
          </div>
        </div>
        <hr className="my-2 border-t border-gray-300" />

        <div className="flex justify-between items-center">
          <div
            onClick={onLike}
            className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-black ${
              isLiked ? "text-blue-600" : ""
            } `}
          >
            <ThumbsUp size={18} />
            <span className="hidden md:block">Like</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-black"
            onClick={() => setShowComment(!showComment)}
          >
            <MessageCircle size={18} />
            <span className="hidden md:block">Comment</span>
          </div>
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <div
                onClick={onShare}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-black"
              >
                <Share2 size={18} />
                <span className="hidden md:block">Share</span>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Share this Video
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-4">
                {["Facebook", "Instagram", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className="w-full text-center py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                    style={{ backgroundColor: getPlatformColor(platform) }}
                    onClick={() => handleShare(platform.toLowerCase())}
                  >
                    Share On {platform}
                  </button>
                ))}
                <button
                  className="w-full text-center py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                  style={{ backgroundColor: getPlatformColor("Copy") }}
                  onClick={() => handleShare("copy")}
                >
                  Copy Link
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Comment Section with Animation */}
        {/* <AnimatePresence>
          {showComment && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              //   exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              ref={commentRef}
              className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-500"
            >
              <ScrollArea className="text-gray-600 dark:text-gray-300 h-[300px] w-full rounded-md border p-4">
                <VideoComments comments={post.comments} />
              </ScrollArea>

            
              <div className="flex items-center gap-3 mt-3 bg-white dark:bg-gray-900 p-2 rounded-md shadow-md">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Send
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
                    size={24}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}
        <AnimatePresence>
          {showComment && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              ref={commentRef}
              className="mt-4 p-4 bg-gray-100 dark:bg-neutral-600 rounded-lg transition-All duration-500"
            >
              <ScrollArea className="text-gray-600 h-[300px] w-full rounded-md border p-4 dark:bg-neutral-800">
                <VideoComments post={post} onComments={onComments} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VideoCard;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Delete,
  Ellipsis,
  MessageCircle,
  Share2,
  ThumbsUp,
  Trash,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import PostComment from "./PostComment";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import userStore from "@/store/userStore";
import { formatData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/store/usePostStore";

const Postcard = ({isOwner, post, isLiked, onShare, onComments, onLike }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeletePostDropDownOpen, setIsDeletePostDropDownOpen] =
    useState(false);
  const [showComment, setShowComment] = useState(false);
  const commentRef = useRef(null);
  const { user } = userStore();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const {handleDeletePost}=usePostStore();


  const userPostPlaceholder = user?.username
    ?.split(" ") // Split into words
    .filter(Boolean) // Remove extra spaces
    .map((word) => word[0]) // Take the first letter of each word
    .join("")
    .toUpperCase();

    const onDelete = (postId) => {
      handleDeletePost(postId);
    };

  // Generate a sharable link
  const generateSharableLink = () => {
    return `https://localhost:3000/${post?.id}`;
  };

  // Handle social media sharing
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDeletePostDropDownOpen(false);
      }
    };

    if (isDeletePostDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDeletePostDropDownOpen]);
  // Handle clicking outside the comment box
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

  const handleUserProfileLink = () => {
    const userId = post?.user._id;
    console.log("its userid", userId);

    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  // Get platform colors
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
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md w-full p-4 md:p-6 h-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div
          className="flex items-center space-x-4 cursor-pointer "
          onClick={handleUserProfileLink}
        >
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
          <div className="flex flex-col ">
            <p className="font-medium dark:text-white">
              {post?.user?.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-white">
              {formatData(post?.createdAt)}
            </p>
          </div>
        </div>
        <div className="relative">
          <Ellipsis
            onClick={() => setIsDeletePostDropDownOpen((prev) => !prev)}
            className="cursor-pointer"
          />
          {isDeletePostDropDownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10"
            >
              
              <button
              onClick={() => onDelete(post._id)}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Trash size={18} />
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Content */}
      <div className="h-auto p-4">
        {post.mediaUrl && post.mediaType === "image" && (
          <img
            src={post.mediaUrl}
            alt="Image Post"
            className="w-full max-h-[400px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-cover rounded-lg mb-4"
          />
        )}
        {post.mediaUrl && post.mediaType === "video" && (
          <video
            controls
            src={post.mediaUrl}
            className="w-full max-h-[400px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-cover rounded-lg mb-4"
          >
            Your browser does not support this video.
          </video>
        )}
        <p className="font-medium dark:text-white">{post.content}</p>
      </div>

      {/* Like, Comment & Share Section */}
      <div className="flex flex-col mx-4">
        <div className="flex items-center justify-between">
          <p className="text-sm dark:text-gray-300 text-gray-600 font-semibold">
            {post?.likeCount} likes
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p
              className="text-gray-600 dark:text-gray-300 font-semibold cursor-pointer"
              onClick={() => setShowComment(!showComment)}
            >
              {post?.commentCount || 0} comments
            </p>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
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
            <ThumbsUp size={18} className={`dark:text-white }`} />
            <span className="hidden sm:block dark:text-white">Like</span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-black"
            onClick={() => setShowComment(!showComment)}
          >
            <MessageCircle size={18} className=" dark:text-white" />
            <span className="hidden sm:block  dark:text-white">Comment</span>
          </div>
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <div
                onClick={onShare}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-black"
              >
                <Share2 size={18} className=" dark:text-white" />
                <span className="hidden sm:block  dark:text-white">Share</span>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Share this Post
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Choose a platform to share this post.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-4">
                {["Facebook", "Instagram", "LinkedIn"].map((platform) => (
                  <div
                    key={platform}
                    className="w-full text-center py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                    style={{ backgroundColor: getPlatformColor(platform) }}
                    onClick={() => handleShare(platform.toLowerCase())}
                  >
                    Share on {platform}
                  </div>
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
                <PostComment post={post} onComments={onComments} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Postcard;

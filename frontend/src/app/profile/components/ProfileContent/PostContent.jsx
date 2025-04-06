import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import PostComment from "@/app/Post/PostComment";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatData } from "@/lib/utils";

const PostContent = ({ post, isLiked, onShare, onComments, onLike }) => {
  const [showComment, setShowComment] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const commentRef = useRef(null);

  const userPostPlaceholder = post?.user?.username
    ?.split(" ") // Split into words
    .filter(Boolean) // Remove extra spaces
    .map((word) => word[0]) // Take the first letter of each word
    .join("")
    .toUpperCase();
  // Generates a shareable link
  const generateSharableLink = () => {
    return `${window.location.origin}/post/${post.id}`;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: "#1877F2",
      Twitter: "#1DA1F2",
      LinkedIn: "#0077B5",
      Copy: "#333",
    };
    return colors[platform] || "#000";
  };

  const handleShare = (platform) => {
    let shareUrl = "";
    const url = generateSharableLink();

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case "LinkedIn":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
        break;
      case "Copy":
        navigator.clipboard.writeText(url);
        setIsShareModalOpen(false);
        alert("Link copied to clipboard!");
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full p-4 md:p-6 h-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            {post?.user?.profilePicture ? (
              <AvatarImage
                src={post?.user?.profilePicture}
                alt={post?.user?.username}
              />
            ) : (
              <AvatarFallback className="dark:bg-white text-black bg-gray-400">
                {userPostPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">{post.user.username}</p>
            <p className="text-sm text-gray-600">
              {formatData(post?.createdAt)}
            </p>
          </div>
        </div>
        <Ellipsis className="cursor-pointer" />
      </div>

      {/* Media Content */}
      <div className="h-auto p-4">
        {post.mediaUrl && post.mediaType === "image" && (
          <img
            src={post.mediaUrl}
            alt="Post Image"
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
      </div>

      {/* Like, Comment & Share Section */}
      <div className="flex flex-col mx-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-semibold">
            {post.likeCount} Likes
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p className="text-gray-600 font-semibold cursor-pointer">
              {post.commentCount || 0} comments
            </p>
            <p className="text-gray-600 font-semibold">
              {post.shareCount} shares
            </p>
          </div>
        </div>
        <hr className="my-2 border-t border-gray-300" />
        <div className="flex justify-between items-center">
          <div 
          onClick={onLike}
          className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:text-black ${isLiked ? "text-blue-500" : ""}`}
          
          >
            <ThumbsUp size={18} />
            <span className="hidden sm:block dark:text-white">Like</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:text-black"
            onClick={() =>{ 
              setShowComment(!showComment)
              handleCommen
            
            }}
          >
            <MessageCircle size={18} />
            <span className="hidden sm:block dark:text-white">Comment</span>
          </div>
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <div
              onClick={onShare}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:text-black"
              >
                <Share2 size={18} />
                <span className="hidden sm:block dark:text-white">Share</span>
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
                {["Facebook", "Twitter", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className="w-full text-center py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                    style={{ backgroundColor: getPlatformColor(platform) }}
                    onClick={() => handleShare(platform)}
                  >
                    Share on {platform}
                  </button>
                ))}
                <button
                  className="w-full text-center py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                  style={{ backgroundColor: getPlatformColor("Copy") }}
                  onClick={() => handleShare("Copy")}
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              ref={commentRef}
              className="mt-4 p-4 bg-gray-100 rounded-lg transition-All duration-500"
            >
              <ScrollArea className="text-gray-600 h-[300px] w-full rounded-md border p-4">
                <PostComment
                 post={post}
                 onComments={onComments}
                //  commentRef={commentRef}
                />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostContent;

import { ChevronDown, ChevronUp, Send } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import userStore from "@/store/userStore";
import { Input } from "@/components/ui/input";
import { formatData } from "@/lib/utils";

const PostComments = ({ post, onComments }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = userStore();
  const visibleComments = showAllComments ? post?.comments : post?.comments?.slice(0, 2);

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      onComments({ text: commentText });
      setCommentText("");
    }
  };

  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join("");

  return (
    <div className="relative"> {/* Ensure proper positioning */}
      <div className="mt-4 max-h-60 overflow-y-auto pr-2">
        <h3 className="font-semibold mb-2">Comments</h3>
        {visibleComments?.map((comment, index) => (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <Avatar className="w-8 h-8">
              {comment?.user?.profilePicture ? (
                <AvatarImage src={comment?.user?.profilePicture} alt={comment?.user?.username} />
              ) : (
                <AvatarFallback className="dark:bg-gray-400">{userPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <div className="rounded-lg p-2">
                <p className="font-bold text-sm">{comment?.user?.username}</p>
                <p className="text-sm">{comment?.text}</p>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <Button variant="ghost" size="sm">Like</Button>
                <Button variant="ghost" size="sm">Reply</Button>
                <span>{formatData(comment.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}

        {post?.comments?.length > 2 && (
          <p
            className="w-40 mt-2 bg-blue-500 text-white rounded-xl flex items-center justify-center py-2 cursor-pointer"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </p>
        )}
      </div>
      
      {/* Sticky Input Section */}
      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900  shadow-lg flex items-center gap-4 rounded-t-lg no-scrollbar ">
        <Avatar className="w-10 h-10">
          {user?.profilePicture ? (
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
          ) : (
            <AvatarFallback className="dark:bg-gray-500 text-white font-medium">
              {userPlaceholder}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex relative no-scrollbar items-center flex-grow bg-gray-100 dark:bg-gray-800 rounded-lg px-4 ">
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            type="text"
            placeholder="Write a comment..."
            className="w-full bg-transparent border border-gray-400 shadow-md focus:outline-none text-gray-900 dark:text-gray-100 p-3"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCommentSubmit}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 rounded-xl bg-blue-500 transition-all"
          >
            <Send size={20} className="text-white " />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
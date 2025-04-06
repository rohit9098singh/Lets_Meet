import { motion } from "framer-motion";
import React from "react";

const FriendRequestSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg"
    >
      {/* Avatar Skeleton */}
      <div className="flex justify-center">
        <div className="h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
      </div>

      {/* Name Skeleton */}
      <div className="mt-4 flex justify-center">
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 animate-pulse rounded" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded" />
      </div>
    </motion.div>
  );
};
const FriendSuggestionSkeleton = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg"
      >
        {/* Avatar Skeleton */}
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        </div>
  
        {/* Name Skeleton */}
        <div className="mt-4 flex justify-center">
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 animate-pulse rounded" />
        </div>
  
        {/* Confirm Button Skeleton (Without Delete Button) */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded" />
        </div>
      </motion.div>
    );
  };
export { FriendRequestSkeleton,FriendSuggestionSkeleton};

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { userFriendStore } from "@/store/userFriendStore";
import { useRouter } from "next/navigation";

const MutualFriends = ({ id, isOwner }) => {
  const { fetchMutualFriends, unFollowUser, mutualFriends } = userFriendStore();
  const router=useRouter();

  useEffect(() => {
    if (id) fetchMutualFriends();
  }, [id, fetchMutualFriends]);

  const handleUnfollow = async (userId) => {
    await unFollowUser(userId);
    fetchMutualFriends(id);
  };

  const handleNavigationProfile=(userId)=>{
       router.push(`/profile/${userId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Mutual Friends
          </h2>

          {mutualFriends?.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No mutual friends found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualFriends.map((friend) => (
                <div
                onClick={()=>handleNavigationProfile(friend._id)}
                  key={friend._id}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between transition hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      {friend.profilePicture ? (
                        <AvatarImage
                          src={friend.profilePicture}
                          alt={friend.username}
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-600">
                          {friend.username?.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {friend.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.followerCount} followers
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <p className="cursor-pointer">
                          <MoreHorizontal className="h-5 w-5 text-black hover:text-neutral-900/30" />
                        </p>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => handleUnfollow(friend._id)}
                        >
                          <UserX className="h-4 w-4" /> Unfollow
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MutualFriends;

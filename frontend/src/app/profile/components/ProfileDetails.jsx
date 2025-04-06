"use client";
import React, { useEffect, useState } from "react";
import PostContent from "./ProfileContent/PostContent";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import MutualFriends from "./ProfileContent/MutualFriends";
import EditBio from "./ProfileContent/EditBio";
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";
import { formatDateInDDMMYYY } from "@/lib/utils";

const ProfileDetails = ({
  activeTab,
  id,
  profileData,
  isOwner,
  fetchProfile,
}) => {
  const [isEditBioModal, setIsEditBioModal] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const {
    userPosts,
    fetchUserPost,
    handleLikePost,
    handleCommentPost,
    handleSharePost,
  } = usePostStore();

  useEffect(() => {
    if (id) {
      fetchUserPost(id);
    }
  }, [id, fetchUserPost]);

  useEffect(() => {
    const saveLikes = localStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLike = async (postId) => {
    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
      toast.error("Post disliked successfully");
    } else {
      updatedLikePost.add(postId);
      toast.success("Post liked successfully");
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    try {
      await handleLikePost(postId);
      await fetchUserPost();
    } catch (error) {
      console.error(error);
      toast.error("Failed to like or unlike the post");
    }
  };

  // console.log("inside the eidt part", profileData);
  const profileDetails = [
    {
      icon: Home,
      text: `Live In: ${profileData?.bio?.liveIn || "Not Provided"}`,
    },
    {
      icon: Heart,
      text: `Relationship: ${profileData?.bio?.relationShip || "Not Provided"}`,
    },
    {
      icon: MapPin,
      text: `From: ${profileData?.bio?.homeTown || "Not Provided"}`,
    },
    {
      icon: Briefcase,
      text: `Work At: ${profileData?.bio?.workPlace || "Not Provided"}`,
    },
    {
      icon: GraduationCap,
      text: `Education: ${profileData?.bio?.education || "Not Provided"}`,
    },
    { icon: Rss, text: `followed by: ${profileData?.followerCount} person` },
    {
      icon: Mail,
      text: `Email: ${profileData?.email}"`,
    },
    {
      icon: Cake,
      text:
        ` Birthday: ${formatDateInDDMMYYY(profileData?.dateOfBirth)} ` ||
        "not providede",
    },
  ];
  // console.log("profile data", profileData);
  const tabsContent = {
    posts: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        <div className="w-full space-y-6">
          {userPosts.map((post) => (
            <PostContent
              key={post._id}
              post={post}
              isLiked={likePosts.has(post?._id)}
              onLike={() => handleLike(post?._id)}
              onComments={async (comment) => {
                await handleCommentPost(post?._id, comment.text);
                await fetchUserPost();
              }}
              onShare={async () => {
                await handleSharePost(post?._id);
                await fetchUserPost();
              }}
            />
          ))}
        </div>
        <div className="w-full lg:w-[40%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                Intro
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profileData?.bio?.bioText || "Not Provided"}
              </p>
              <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span> {profileData?.bio?.liveIn || "Not Provided"}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>
                    {profileData?.bio?.relationShip || "Not Provided"}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.homeTown || "Not Provided"}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span> {profileData?.bio?.workPlace || "Not Provided"}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span> {profileData?.bio?.education || "Not Provided"}</span>
                </div>
              </div>
              <div className="flex items-center mb-4 dark:text-gray-300">
                <Rss className="w-5 h-5 mr-2" />
                <span>
                  Followed by {profileData?.followerCount || "Not Provided"}{" "}
                  people
                </span>
              </div>

              {isOwner && (
                <Button
                  className="w-full "
                  onClick={() => setIsEditBioModal(true)}
                >
                  Edit Bio
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    ),
    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              {profileData?.username || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {profileData?.bio?.bioText || "No bio available"}
            </p>
            <div className="space-y-2 mb-4">
              {profileDetails.map(({ icon: Icon, text }, index) => (
                <div
                  key={index}
                  className="flex gap-2 text-black dark:text-white"
                >
                  <Icon size={16} className="w-5 h-5 text-green-500 " />
                  <span className="font-semibold text-md">{text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: <MutualFriends id={id} isOwner={isOwner} />,
    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              Photos
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPosts
                ?.filter(
                  (post) => post?.mediaType === "image" && post?.mediaUrl
                )
                .map((post) => (
                  <img
                    key={post?._id}
                    src={post?.mediaUrl}
                    alt="user_all_photos"
                    className="w-[200px] h-[150px] object-cover rounded-lg"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
  };

  return (
    <div>
      {tabsContent[activeTab] || null}
      <EditBio
        isOpen={isEditBioModal}
        onClose={() => setIsEditBioModal(!isEditBioModal)}
        fetchProfile={fetchProfile}
        initialData={profileData?.bio}
        id={id}
        isOwner={isOwner}
      />
    </div>
  );
};

export default ProfileDetails;

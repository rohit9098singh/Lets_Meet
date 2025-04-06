"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import LeftSidebar from "@/components/component/LeftSideBar/LeftSideBar";
import { usePostStore } from "@/store/usePostStore";
import VideoCard from "./components/VIdeoCard";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();

  const handleClickBackToHome = () => {
    router.push("/");
  };
  const [likePosts,setLikePosts] = useState(new Set());
  const {posts,fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();

  useEffect(() =>{
    fetchPost()
  },[fetchPost])

  useEffect(() =>{
    const saveLikes = localStorage.getItem('likePosts');
    if(saveLikes){
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  },[]);


  const handleLike = async(postId)=>{
    const updatedLikePost = new Set(likePosts);
    if(updatedLikePost.has(postId)){
      updatedLikePost.delete(postId);
      toast.error('post disliked successfully')
    }else {
      updatedLikePost.add(postId)
      toast.success('post like successfully')
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem('likePosts',JSON.stringify(Array.from(updatedLikePost)))

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
       console.error(error);
       toast.error('failed to like or unlike the post')
    }
  }

    const videoPost=posts.filter(post=> post.mediaType==="video");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      <div className="ml-0 lg:ml-64 mt-16 p-6">
        <header
          onClick={handleClickBackToHome}
          className="flex items-center gap-2 px-4 py-2 mb-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md mx-auto"
        >
          <ChevronLeft size={20} className="font-bold" />
          <p className="font-semibold text-lg">Back To Feeds</p>
        </header>

        <main className="w-full flex flex-col gap-4 mx-auto md:w-1/2">
          {videoPost.map((post, index) => (
            <VideoCard
              key={post?._id}
              post={post} 
              isLiked={likePosts.has(post?._id)}
              onLike={() => handleLike(post?._id)}
              onComments={async (comment) => {
                await handleCommentPost(post?._id, comment.text);
                await fetchPost();
              }}
              onShare={async () => {
                await handleSharePost(post?._id);
                await fetchPost();
              }}
              
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default Page;

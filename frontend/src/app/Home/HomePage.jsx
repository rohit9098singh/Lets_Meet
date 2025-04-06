"use client";

import { useEffect, useState } from "react";
import StorySection from "../StorySection/StorySection";
import NewPostForm from "../Post/NewPostForm";
import Postcard from "../Post/Postcard";
import toast from "react-hot-toast";
import LeftSidebar from "@/components/component/LeftSideBar/LeftSideBar";
import RightSidebar from "@/components/component/RightSideBar/RightSideBar";
import { usePostStore } from "@/store/usePostStore";

const HomePage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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

  return (
    <div className="flex flex-col min-h-screen   text-foreground">
      <main className="flex flex-1 pt-16">
        <div className=" lg:block">
          <LeftSidebar className="bg-gradient-to-b from-black to-purple-700clear"/>
        </div>

        {/* Main Content Section */}
        <div className="flex-1 px-4 py-6 mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <div className="lg:ml-44 lg:mr-44">
            <StorySection />
            <NewPostForm
              isPostFormOpen={isPostFormOpen}
              setIsPostFormOpen={setIsPostFormOpen}
            />

            {/* Post List */}
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <Postcard
                  key={post?._id}
                  post={post}
                  isOwner={isOwner}
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
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
};

export default HomePage;

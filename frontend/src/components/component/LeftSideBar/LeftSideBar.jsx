"use client";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Users,
  VideoIcon,
  User,
  MessageCircle,
  Bell,
  LogOut,
} from "lucide-react";
import useSidebarStore from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";
import toast from "react-hot-toast";

const LeftSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const leftSidebarRef = useRef(null);
  const { user, clearUser } = userStore();
  const userId = user?._id || "";
  const router = useRouter();

  const userPlaceholder = user?.username
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleSidebarRoute = (path) => {
    router.push(path);
    if (isSidebarOpen) toggleSidebar();
  };

  const handleLogout = async () => {
    try {
      // Simulated logout API request
      clearUser();
      router.push("/userLogin");
      toast.success("User logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again later");
    }
  };

  const navItems = [
    { icon: <Home size={24} />, path: "/", name: "Home" },
    { icon: <Users size={24} />, path: "/friends-list", name: "Friends" },
    { icon: <VideoIcon size={24} />, path: "/video-feed", name: "Videos" },
    { icon: <User size={24} />, path: `/profile/${userId}`, name: "Profile" },
    { icon: <MessageCircle size={24} />, path: "/messages", name: "Messages" },
    { icon: <Bell size={24} />, path: "/notifications", name: "Notifications" },
  ];
// console.log(isSidebarOpen)
  return (
    <div
      ref={leftSidebarRef}
      className={`fixed top-16 flex flex-col justify-between left-0 h-full p-4 bg-white dark:bg-neutral-800 shadow-xl border-r border-gray-300 dark:border-gray-700 transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? " w-64 flex":"hidden lg:flex lg:w-64"
      }`}
    >
      <div>
        {/* User Profile */}
        <div
          onClick={() => handleSidebarRoute(`/profile/${user?._id}`)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
        >
          <Avatar>
            {user?.profilePicture ? (
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
            ) : (
              <AvatarFallback className="bg-gray-400">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">{user?.username}</span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex flex-col space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              onClick={() => handleSidebarRoute(item.path)}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span className="text-base font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="mb-14">
        <hr className="border-gray-300 dark:border-gray-700 my-1" />
        <div
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 p-3 rounded-lg text-neutral-800 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <LogOut size={24} className="text-gray-800 dark:text-white" />
          <span className="text-base font-medium">Logout</span>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <p>
            Privacy · Terms · Advertising · Meta ©{" "}
            <span className="flex items-center justify-center"> 2024 </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;

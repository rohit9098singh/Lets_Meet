"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  User,
  User2,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { logoutUser } from "@/service/auth.service";
import userStore from "@/store/userStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/service/user.service";
import useSidebarStore from "@/store/sidebarStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setIsActiveTab] = useState("Home");

  const { toggleSidebar } = useSidebarStore();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResult([]);
        setShowDropDown(false);
        return;
      }
      try {
        const users = await getAllUsers(searchTerm);
        setSearchResult(users);
        setShowDropDown(users.length > 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debounceSearch = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  const { theme, setTheme } = useTheme();
  const searchDropDownRef = useRef();
  const { user, clearUser } = userStore();

  const userPlaceholder = user?.username
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropDownRef.current &&
        !searchDropDownRef.current.contains(event.target)
      ) {
        setShowDropDown(false);
      }
    };

    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropDown]);

  const navLinks = [
    { icon: Home, path: "/", name: "Home" },
    { icon: Video, path: "/video-feed", name: "Videos" },
    { icon: User, path: "/friends-list", name: "Friends" },
  ];

  const router = useRouter();

  const handleRouteToHome = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result?.status === "success") {
        router.push("/userLogin");
      }
      toast.success("User Logged out successfully");
      clearUser();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again later");
    }
  };

  const handleNavigateToProfile = async (userId) => {
    try {
      setLoading(true);
      setShowDropDown(false);
      setSearchTerm("");
      router.push(`/profile/${userId}`);
    } catch (error) {
      console.error("Error navigating to profile:", error);
      toast.error("Unable to navigate to profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white dark:bg-neutral-900 text-foreground shadow-md h-16 fixed top-0 left-0 right-0 z-50 p-2">
      <div className="mx-auto flex justify-between items-center p-2 px-4 md:px-8">
        {/* Logo and Search Bar */}
        <div className="flex items-center gap-4">
          <p
            onClick={handleRouteToHome}
            className="text-md font-semibold cursor-pointer"
          >
            Let's Meet
          </p>
          <div className="relative">
            <div>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 w-40 md:w-64 h-10 bg-gray-100 dark:bg-slate-800 rounded-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropDown(true)}
              />
            </div>

            {/* Search results dropdown */}
            {showDropDown && (
              <ul className="absolute w-72 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border dark:border-gray-700">
                {searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                      onClick={() => handleNavigateToProfile(user._id)}
                    >
                      {/* Profile Picture and Username */}
                      <div className="flex items-center gap-x-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-white">
                            {userPlaceholder}
                          </div>
                        )}
                        <span className="text-gray-900 dark:text-gray-200">
                          {user.username}
                        </span>
                      </div>

                      {/* Search Icon for Each User */}
                      <Search
                        size={24}
                        className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-full p-1"
                      />
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 dark:text-gray-400">
                    No user found
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex justify-around w-[40%] max-w-md">
          {navLinks.map(({ icon: Icon, path, name }) => (
            <Button
              onClick={() => {
                router.push(path);
                setIsActiveTab(name);
              }}
              key={name}
              variant="ghost"
              size="icon"
              className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-transparent ${
                activeTab === name ? "text-blue-500" : ""
              }`}
            >
              <Icon />
            </Button>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex space-x-4 items-center">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            className="lg:hidden text-gray-600"
          >
            <Menu />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-400">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 z-50" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Avatar>
                    {user?.profilePicture ? (
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user?.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-400">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="cursor-pointer">
                    <p className="font-semibold text-sm">{user?.username}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleNavigateToProfile(user._id)}
                className="cursor-pointer"
              >
                <User2 />{" "}
                <span className="ml-2 font-semibold text-sm">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/messages")}
                className="cursor-pointer"
              >
                <MessageCircle />{" "}
                <span className="ml-2 font-semibold text-sm">Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
                {theme === "light" ? (
                  <Moon className="mr-2" />
                ) : (
                  <Sun className="mr-2" />
                )}
                {theme === "light" ? (
                  <span className="font-semibold text-sm">Dark Mode</span>
                ) : (
                  <span className="font-semibold text-sm">Light Mode</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut />{" "}
                <span className="ml-2 font-semibold text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;

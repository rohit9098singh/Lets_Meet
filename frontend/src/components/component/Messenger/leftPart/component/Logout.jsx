"use client";
import userStore from "@/store/userStore";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();
  const { clearUser } = userStore();

  const handleLogout = async () => {
    try {
      clearUser();
      router.push("/userLogin");
      toast.success("User logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again later");
    }
  };

  return (
    <div className="flex flex-col items-center w-full sticky bottom-4">
      <hr className="border-gray-300 dark:border-gray-700 w-full my-2" />
      <div
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-md text-gray-800 dark:text-white 
                  hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition w-40 justify-center"
      >
        <LogOut size={20} />
        <span className="text-base">Logout</span>
      </div>
    </div>
  );
};

export default Logout;

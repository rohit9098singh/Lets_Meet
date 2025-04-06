"use client";
import React, { useState, useEffect } from "react";
import Left from "@/components/component/Messenger/LeftPart/Left";
import Right from "@/components/component/Messenger/RightPart/Right";
import { userFriendStore } from "@/store/userFriendStore";

const Page = () => {
  const { fetchMutualFriends, mutualFriends } = userFriendStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        await fetchMutualFriends();
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []); 

  useEffect(() => {
    if (mutualFriends.length > 0 && !selectedUser) {
      setSelectedUser("");
    }
  }, [mutualFriends]); 

  return (
    <div className="w-full flex bg-gray-200 pt-16 min-h-screen">
      <div className="w-full sm:w-[35%]">
        <Left users={mutualFriends} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
      </div>
      <div className="w-[65%] hidden sm:block">
        <Right selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Page;

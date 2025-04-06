import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { userFriendStore } from "@/store/userFriendStore";

const SearchBar = () => {
  const { mutualFriends, fetchMutualFriends, isLoading } = userFriendStore(); // Fetch from store
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(() => {
    fetchMutualFriends();
  }, [fetchMutualFriends]);

  // Filter mutual friends based on input
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFriends([]);
    } else {
      const filtered = mutualFriends.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchTerm, mutualFriends]);

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={20}
      />
      <Input
        type="text"
        placeholder="Search mutual friends..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Loading State */}
      {isLoading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}

      {/* Display filtered mutual friends */}
      {searchTerm && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => {
              const userPlaceholder = friend?.username
                ?.split(" ")
                .filter(Boolean)
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={friend._id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <div className="flex items-center gap-x-3">
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={friend.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-white">
                        {userPlaceholder}
                      </div>
                    )}
                    <span className="text-gray-900 dark:text-gray-200">
                      {friend.username}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-2 text-gray-500 text-center">No user found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

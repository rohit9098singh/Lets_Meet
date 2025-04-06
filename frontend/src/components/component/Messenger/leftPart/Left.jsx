import React from "react";
import Search from "./component/Search";
import Users from "./component/Users";
import Logout from "./component/Logout";

const Left = ({ users, setSelectedUser, selectedUser }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 h-full flex flex-col">
      <Search />
      <div className="flex flex-col justify-between h-full">
        {/* Pass props to Users */}
        <Users users={users} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
        <Logout />
      </div>
    </div>
  );
};

export default Left;

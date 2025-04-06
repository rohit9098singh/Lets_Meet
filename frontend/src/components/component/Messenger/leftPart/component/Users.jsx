import useSocketStore from "@/store/socketStore";
import React from "react";

const Users = ({ users, setSelectedUser, selectedUser }) => {
  const { socket, onlineUsers } = useSocketStore();
  return (
    <div className="w-full mt-2 dark:bg-gray-900 p-4">
      <h1 className="text-center text-lg font-semibold p-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">
        Messages
      </h1>

      <div className="mt-3 space-y-2 h-full overflow-y-auto no-scrollbar">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No mutual friends found.
          </p>
        ) : (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user?._id); // Har user ke liye check karenge
            console.log(`User: ${user.username}, Online: ${isOnline}`);

            const placeholder = user.username
              .split(" ")
              .filter(Boolean)
              .map((word) => word[0])
              .join("")
              .toUpperCase();
            return (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)} // Select user on click
                className={`flex items-center space-x-4 p-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer ${
                  selectedUser?._id === user._id
                    ? "bg-gray-300 dark:bg-slate-700"
                    : ""
                }`}
              >
                <div className="relative">
                  {" "}
                  {/* This div should be relative */}
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center font-semibold text-white">
                      {placeholder}
                    </div>
                  )}
                  {/* Online status dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </span>
                  <span className="text-sm text-gray-600 whitespace-normal dark:text-gray-400">
                    {user.email}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Users;
// import useConversation from "@/store/useConversation";
// import React from "react";

// const Users = ({ users }) => {
//   const { selectedConversation, setSelectedConversation } = useConversation();

//   return (
//     <div className="w-full mt-2 dark:bg-gray-900 p-4">
//       <h1 className="text-center text-lg font-semibold p-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md">
//         Messages
//       </h1>

//       <div className="mt-3 space-y-2 h-full overflow-y-auto no-scrollbar">
//         {users.length === 0 ? (
//           <p className="text-center text-gray-500 dark:text-gray-400">
//             No mutual friends found.
//           </p>
//         ) : (
//           users.map((user) => {
//             const placeholder = user.username
//               .split(" ")
//               .filter(Boolean)
//               .map((word) => word[0])
//               .join("")
//               .toUpperCase();

//             const isSelected = selectedConversation?._id === user._id;

//             return (
//               <div
//                 key={user._id}
//                 onClick={() => setSelectedConversation(user)} //  Fixed incorrect function call
//                 className={`flex items-center space-x-4 p-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer ${
//                   isSelected ? "bg-gray-300 dark:bg-slate-700" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   {user.profilePicture ? (
//                     <img
//                       src={user.profilePicture}
//                       alt={user.username}
//                       className="w-8 h-8 rounded-full"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center font-semibold text-white">
//                       {placeholder}
//                     </div>
//                   )}
//                   {/* Online status dot */}
//                   <span
//                     className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
//                       user.isOnline ? "bg-green-500" : "bg-gray-400"
//                     }`}
//                   ></span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-md font-medium text-gray-900 dark:text-white">
//                     {user.username}
//                   </span>
//                   <span className="text-sm text-gray-600 whitespace-normal dark:text-gray-400">
//                     {user.email}
//                   </span>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default Users;

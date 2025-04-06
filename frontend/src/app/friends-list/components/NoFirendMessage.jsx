import React from "react";
import { motion } from "framer-motion";
import { UserX } from "lucide-react";
const NoFirendMessage = ({ text, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full p-8 text-center"
    >
      <UserX size={64} className="text-gray-400 mb-4" />
      <h3 className="text-2xl font-semibold mb-2">{text}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
    </motion.div>
  );
};

export default NoFirendMessage;

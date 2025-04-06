const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
     deletedBy: {  
      type: [mongoose.Schema.Types.ObjectId], 
      default: [],
    }
  },
  { timestamps: true } 
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message; 

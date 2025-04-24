const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    type: {
      type: String,
      enum: ["message", "reaction", "follow", "unfollow"],
      required: true,
    },
    message: { type: String, required: true },
    content: { type: String, default: null }, 
    read: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

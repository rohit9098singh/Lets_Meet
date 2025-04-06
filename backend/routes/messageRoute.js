const express=require("express");
const {sendMessage, getMessages, deleteForEveryOne, deleteForMe}=require("../controllers/messsageController");
const authMiddleware = require("../middleware/authMiddleware");

const  router = express.Router();

router.post("/send/:id",authMiddleware,sendMessage);
router.get("/get/:id",authMiddleware,getMessages);

router.post("/deleteForMe",authMiddleware,deleteForMe)
router.post("/deleteForEveryOne",authMiddleware,deleteForEveryOne)

module.exports=router

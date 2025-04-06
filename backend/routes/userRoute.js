const express=require("express");
const authMiddleware =require("../middleware/authMiddleware");
const { followUser, unFollowUser, deleteUserFromRequest, getAllMutualFriends, getAllFriendRequest, getAllUserForRequest, getAllUsers, getUserProfile, checkUserAuth, getAllRegisterUser } = require("../controllers/userController");
const { createOrUpdateUserBio, updateCoverPhoto, updateUserProfile } = require("../controllers/createOrUpdateController");
const { multerMiddleware } = require("../config/cloudinary");
const router=express.Router();

router.post("/follow",authMiddleware,followUser)
router.post("/unfollow",authMiddleware,unFollowUser)
router.post("/remove/friend-request",authMiddleware,deleteUserFromRequest);
router.get("/friend-request",authMiddleware,getAllFriendRequest);
router.get("/users-to-request",authMiddleware,getAllUserForRequest)
router.get("/mutual-friends",authMiddleware,getAllMutualFriends)
router.get("/all-users",authMiddleware,getAllUsers);
router.get("/registered-users",getAllRegisterUser)
router.get("/profile/:userId",authMiddleware,getUserProfile)

router.get("/check-auth",authMiddleware,checkUserAuth)

//create or update userbio
router.put("/bio/:userId",authMiddleware,createOrUpdateUserBio)
router.put("/profile/:userId",multerMiddleware.single("profilePicture"),updateUserProfile)
router.put("/profile/cover-photo/:userId",multerMiddleware.single("coverPhoto"),updateCoverPhoto)
module.exports= router;
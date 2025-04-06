const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const {
  createPost,
  getAllPost,
  getPostByUserId,
  likePost,
  sharePost,
  addCommentToPost,
  getAllStory,
  createStory,
  deletePost,
} = require("../controllers/postController");
const router = express.Router();

router.post("/posts",authMiddleware,multerMiddleware.single("media"), createPost);

router.delete("/posts/:postId", authMiddleware,deletePost);



router.get("/posts", authMiddleware, getAllPost);

router.get("/posts/user/:userId", authMiddleware, getPostByUserId);

router.post("/posts/likes/:postId", authMiddleware, likePost);

router.post("/posts/comments/:postId", authMiddleware, addCommentToPost);

router.post("/posts/share/:postId", authMiddleware, sharePost);

router.post("/story",authMiddleware,multerMiddleware.single("media"), createStory
  );
  
  router.get("/story", authMiddleware, getAllStory);

module.exports = router;

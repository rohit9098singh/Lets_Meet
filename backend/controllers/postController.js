const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/postModel");
const Story = require("../model/storyModel");
const response = require("../utils/responseHandler");

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("this is my userid", userId);

    const { content } = req.body;
    const file = req.file;
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);

      mediaUrl = uploadResult?.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    }

    // create new post now
    const newPost = await new Post({
      user: userId,
      content,
      mediaUrl,
      mediaType,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    });

    await newPost.save();

    return response(res, 201, "Post created succesfully", newPost);
  } catch (error) {
    console.log("error creating the post", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId; 

  try {
    const post = await Post.findById(postId);
    
    if (!post) {
      return response(res, 404, "Post Not Found");
    }

    if (post.user.toString() !== userId) {
      return response(res, 403, "You are not authorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    return response(res, 200, "Post deleted successfully");
  } catch (error) {
    console.log("error deleting post", error);
    return response(res, 500, "Internal server error", error.message);
  }
};


/**
 * kam aise kar rha hai ke pehle ve body se user ke id ko utha raha hai
 * or req.file se us (video,image ) ko uthayega thik hai uske baadh
 *
 * ================= 2nd step ===============
 * hamne
 *    let mediaUrl=null;
 *    let mediaType=null;
 *
 * in dono ko null set kiya hai kyu jab bhi kise variable ko aage kise
 * condition ke basis me set kiya jata hai to uska initial value undefined ya null hota hai
 *
 * ================= 3rd step ===============
 * if (file) check kiya ke kya file maujud hai agar hai to useko cludnary
 * walle function me pass kar ke ek varible me store karwa diya
 * or uska mediaUrl ko set karwa diya jo ke cloudinary provide karta hai and
 *
 * file.mimetype kya hota hai?
 * file.mimetype file ka type batata hai, jaise:
 * "image/png"
 * "image/jpeg"
 * "video/mp4"
 * "video/mkv"
 * "application/pdf" (PDF file)
 */

const createStory=async(req,res)=>{
    try {
        const userId = req.user.userId;    
        const file = req.file;

        if(!file){
            return response(res,400,"file is required to create a story")
        }
        let mediaUrl = null;
        let mediaType = null;
    
        if (file) {
          const uploadResult = await uploadFileToCloudinary(file);
          mediaUrl = uploadResult?.secure_url;
          mediaType = file.mimetype.startsWith("video") ? "video" : "image";
        }
    
        // create new post now
        const newStory = new Story({
          user: userId,
          mediaUrl,
          mediaType,
        
        });
    
        await newStory.save();
    
        return response(res, 201, "story  created succesfully", newStory);
      } catch (error) {
        console.log("error creating the story", error);
        return response(res, 500, "Internal server error", error.message);
      }
}

const getAllStory=async(req,res)=>{
    try {
        const story = await Story.find()
          .sort({ createdAt: -1 }) 
          .populate("user", "_id username profilePicture email")
        return response(res, 201, "story fetched successfuly", story);
      } catch (error) {
        console.log("error getting story", error);
        return response(res, 500, "internal server error", error.message);
      }
}

const getAllPost = async (req, res) => {
  try {
    // Find all posts, sort them by latest first, and populate the user field
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort in descending order (latest first)
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      });
    return response(res, 201, "posts fetched successfuly", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "internal server error", error.message);
  }
};

const getPostByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return response(res, 400, "user id is required to get user post");
    }
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort in descending order (latest first)
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      });
    return response(res, 201, "posts fetched successfuly", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "internal server error", error.message);
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params; 
  const userId = req.user.userId; 

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post Not Found");
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likeCount = Math.max(0, post.likeCount - 1);  
    } else {
      post.likes.push(userId);
      post.likeCount += 1; 
    }

    const updatedPost = await post.save();

    return response(
      res,
      201,
      hasLiked ? "Post unliked " : "post liked",
      updatedPost
    );
  } catch (error) {
    console.log("error", error);
    return response(res, 500, "internal server error", error.message);
  }
};

const addCommentToPost = async (req, res) => {
  const { postId } = req.params; 
  const userId = req.user.userId; 
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post Not Found");
    }

    post.comments.push({
      user: userId,
      text,
    });
    post.commentCount += 1;

    await post.save();

    return response(res, 201, "Comments added successfully", post);
  } catch (error) {
    console.log("error", error);
    return response(res, 500, "internal server error", error.message);
  }
};

const sharePost = async (req, res) => {
  const { postId } = req.params; 
  const userId = req.user.userId; 

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post Not Found");
    }

    const hasUserShared = post.share.includes(userId);

    if (!hasUserShared) {
      post.share.push(userId);
    }

    post.shareCount += 1;

    await post.save();
    return response(res, 201, "post shared successfully", post);
  } catch (error) {
    console.log("error", error);
    return response(res, 500, "internal server error", error.message);
  }
};

module.exports = {
  createPost,
  getAllPost,
  getPostByUserId,
  likePost,
  addCommentToPost,
  sharePost,
  createStory,
  getAllStory,
  deletePost
};

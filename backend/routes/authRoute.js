const express=require("express");
const {registerUser,loginUser, logout, checkEmail} = require("../controllers/authController");
const passport = require("passport");
const { generateToken } = require("../utils/generateToken");

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logout)

//google auth route
router.get("/google",passport.authenticate("google",{
    scope:["profile","email"]
}))

// google callback routes
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${process.env.FRONTEND_URL}/user-login`,session:false}),
 (req,res)=>{
    const accessToken = generateToken(req?.user);

    // Redirect with token as URL parameter instead of setting cookie
    res.redirect(`${process.env.FRONTEND_URL}?token=${accessToken}`)
 }
)

module.exports=router
const User = require("../model/userModel");
const { generateToken } = require("../utils/generateToken");
const response = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { username, email, password, gender } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response(res, 400, "User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender
        });

        await newUser.save();

        const accessToken = generateToken(newUser);

        res.cookie("auth_token", accessToken, { httpOnly: true });

        return response(res, 201, "User created successfully", {
            username: newUser.username,
            email: newUser.email
        });

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error", error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });  
        if (!user) {
            return response(res, 404, "User not found with this email");
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return response(res, 401, "Invalid password"); 
        }

        const accessToken = generateToken(user);  

        res.cookie("auth_token", accessToken, { httpOnly: true });

        return response(res, 200, "User logged in successfully", {  
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error", error.message);
    }
};



const logout=(req,res)=>{
    try {
        res.cookie("auth_token","",{
            httpOnly:true,
            expires:new Date(0)
        })
        return response(res,200,"user logged out successfully")
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error", error.message);
    }

}

module.exports = {registerUser,loginUser,logout};

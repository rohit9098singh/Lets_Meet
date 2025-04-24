const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");
const messageRoute=require("./routes/messageRoute")
const notificationRoute=require("./routes/notificationRoute")
const passport = require("passport"); 
require("./controllers/googleController"); 
const {app,server}=require("./socketIO/server")

dotenv.config();

// const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(passport.initialize()); 

app.use("/api/auth", authRouter);
app.use("/api/users", postRouter); 
app.use("/api/users", userRouter);
app.use("/api/message/",messageRoute);
app.use("/api/notification",notificationRoute)


const PORT = process.env.PORT || 8080;

connectDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error("Failed to connect to MongoDB. Server not started.");
});

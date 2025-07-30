const express = require("express");
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
// Removed cookie-parser since we're using localStorage tokens

const allowedOrigins = [
  "https://lets-meet-l.vercel.app",
  "http://localhost:3000"
];
const corsOption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS" ));
    }
  },
  credentials: true,
};

app.use(cors(corsOption));
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

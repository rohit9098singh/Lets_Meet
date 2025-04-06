const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log(" MongoDB connected successfully");
    } catch (error) {
        console.error(" Error connecting to MongoDB:", error);
    }
};

module.exports = connectDb;

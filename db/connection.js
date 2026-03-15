import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export async function connectDb() { // Create a function to connect MongoBD
    try {
        await mongoose.connect(process.env.MONGODB_URI, 
            {serverSelectionTimeoutMS: 5000}); // Connect to MongoDB with a timeout
        console.log("MongoDB is connected")
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process with an error code
    }
}

export async function disconnectDb() { // Disconnect MongoDB
    try {
        await mongoose.disconnect();
        console.log("MongoDB is disconnected")
    } catch (error) {
        console.error("Failed to disconnect from MongoDB:", error.message);
        process.exit(1); // Exit the process with an error code
    }
}
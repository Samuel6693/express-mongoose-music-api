import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export async function connectDb() { // Create a function to connect MongoBD
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log("MongoDB is connected")
}

export async function disconnectDb() { // Disconnect MongoDB
    await mongoose.disconnect();
    console.log("MongoDB is disconnected")
}
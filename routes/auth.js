import express from "express";
import User from "../models/User.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/token.js";

const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            id: user._id,
            username: user.username
        });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email }).select("+password");

        if (!existingUser) {
            return res.status(401).json({ message: "User credentials are not valid" });
        }

        const isMatch = await existingUser.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "User credentials are not valid" });
        }

        const accessToken = generateAccessToken(existingUser._id);
        const refreshToken = generateRefreshToken(existingUser._id);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username
            },
            accessToken,
            refreshToken
        });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

userRouter.post("/refresh", async (req, res) => {
    router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = verifyRefreshToken(refreshToken);

        const accessToken = generateAccessToken(payload.userId);

        return res.json({ accessToken });

    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
    });
});

export default userRouter;

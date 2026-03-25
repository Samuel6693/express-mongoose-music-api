import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const meRouter = express.Router();

async function getCurrentUser(req, res) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(payload.userId).select("username");

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.json({
            id: user._id,
            username: user.username
        });

    } catch {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

meRouter.get("/me", getCurrentUser);
meRouter.get("/profile", getCurrentUser);

export default meRouter;

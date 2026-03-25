import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const meRouter = express.Router();

meRouter.get("/me", async (req, res) => {
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
});

export default meRouter;

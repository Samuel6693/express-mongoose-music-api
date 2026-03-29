import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const meRouter = express.Router();

meRouter.get("/me", requireAuth, async (req, res) => {

    const user = await User.findById(req.userId);
    
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    
    return res.json(user);
});

export default meRouter;

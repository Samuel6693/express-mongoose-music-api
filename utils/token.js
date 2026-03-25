import jwt from 'jsonwebtoken';

export function generateAccessToken(userId) {
    return jwt.sign(
        { userId }, 
        process.env.JWT_ACCESS_SECRET, 
        {expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"}
    );
}
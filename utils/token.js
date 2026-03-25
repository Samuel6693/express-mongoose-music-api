import jwt from 'jsonwebtoken';

export function generateAccessToken(userId) {
    return jwt.sign(
        { userId }, 
        process.env.JWT_ACCESS_SECRET, 
        {expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"}
    );
}

export function generateRefreshToken(userId) {
    return jwt.sign(
        { userId }, 
        process.env.JWT_REFRESH_SECRET, 
        {expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"}
    );
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        return null;
    }   
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return null;
    }   
}

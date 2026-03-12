import jwt from "jsonwebtoken"

export const authMiddleware = async (req, res, next) => {
    const token = req.header.Authorization;
    if (!token) {
        return res.json({
            success: false,
            message: "Auth Token not found"
        })
    }
    try {
        const res = await jwt.decode(token.split(" ")[1], process.env.JWT_SECRET);
        console.log(res);
    } catch (err) {
        return res.json({
            success: false,
            message: "Invalid auth token"
        })
    }
    next();
}

export const createToken = async (id) => {
    const res = await jwt.sign(id, process.env.JWT_SECRET);
    return res;
}
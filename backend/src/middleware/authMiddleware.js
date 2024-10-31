const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

const verifyToken = promisify(jwt.verify);


const checkAuth = async (req, res) => {

    const authToken = req.cookies["auth-token"];
    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized!" });
    }

    try {
        const decoded = await verifyToken(authToken, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        return res.status(200).json({ "message": "authorized!" });
    } catch (err) {
        console.error("check authorization error:", err);
        return res.status(500).json({ "error": "Unable to authorize." });
    }
}

const authenticateToken = async (req, res, next) => {
    const authToken = req.cookies["auth-token"];

    if (!authToken) {
        return res.status(401).json({ "error": "unauthorized!" });
    }

    try {
        const decoded = await verifyToken(authToken, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("token authorization error", err);
        return res.stattus(500).json({ "error": "Unable to authorize." });
    }
}

module.exports = { checkAuth, authenticateToken };
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization || req.body.token || req.query.token;
        if (!token) {
            return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
        }

        // ✅ Decode JWT and log it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // ✅ Attach decoded token to req.user
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(403).json({ success: false, error: "Token verification failed" });
    }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate users using JWT.
 * 
 * This middleware checks the Authorization header for a valid JWT token,
 * verifies it using the server's secret, and attaches the user ID to the request object.
 * 
 * @middleware
 * @access Private (Protected routes only)
 * @header {string} Authorization - Format: "Bearer <token>"
 * @returns {Object} req.userId - The decoded user ID from the token
 * 
 */
module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ error: "Access Denied: token not found." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach user ID to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Access Denied: Invalid token." });
    }
};

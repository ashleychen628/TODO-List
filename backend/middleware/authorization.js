const jwt = require("jsonwebtoken");

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

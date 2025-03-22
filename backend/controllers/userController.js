const User = require("../schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user.
 * @route POST /api/register
 * @access Public
 * @body {string} name - Full name of the user
 * @body {string} email - Email address
 * @body {string} password - Plain text password
 * @returns {Object} Success message or error
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Successfully registered a new user." });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Log in an existing user.
 * @route POST /api/login
 * @access Public
 * @body {string} email - Registered email
 * @body {string} password - Plain text password
 * @returns {Object} JWT token and user info or error
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User Not Found." });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Password." });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id, name: user.name});
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

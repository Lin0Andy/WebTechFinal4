const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            creation_date: new Date(),
            admin_status: false,
            deletion_date: null,
            update_date: null,
        });

        await newUser.save();

        // res.status(201).json({ message: "User created successfully" });
        res.redirect('/login');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAdmin = user.admin_status;

        // res.json({ message: "Login successful" });
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie('sid');
        res.json({ message: "Logout successful" });
    });
});

module.exports = router;

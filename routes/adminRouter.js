const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// List all users
router.get('/admin', async (req, res) => {
    const language = req.query.lang || 'en';
    const loggedIn = req.session.username !== undefined ? true : false;

    try {
        const users = await User.find();
        const defaultUser = { _id: '', username: '', admin_status: false };
        res.render('admin', { users, user: defaultUser, loggedIn, language });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new user
router.post("/users", async (req, res) => {
    const { username, password, admin_status } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            creation_date: new Date(),
            admin_status: admin_status || false,
            deletion_date: null,
            update_date: null,
        });

        const newUser = await user.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user
router.delete("/users/:id", getUser, async (req, res) => {
    try {
        // await User.findByIdAndDelete(req.params.id);
        // res.json({ message: "User deleted" });
        res.user.deletion_date = new Date();
        res.user.update_date = new Date();
        await res.user.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user information
router.patch("/users/:id", getUser, async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.password != null) {
        res.user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.admin_status != null) {
        res.user.admin_status = req.body.admin_status;
    }
    res.user.update_date = new Date();

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Cannot find user" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;

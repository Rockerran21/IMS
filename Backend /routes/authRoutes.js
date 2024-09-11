const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role
        });

        if (!req.body.username || !req.body.password || !req.body.email || !req.body.phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
                { phone: req.body.phone }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username, email, or phone number already exists' });
        }

        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', { username: req.body.username });

        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ user: { _id: user._id, username: user.username, email: user.email, role: user.role }, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;
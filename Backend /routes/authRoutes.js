const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');  // Adjust the path as needed based on your folder structure


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

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            // Configure your email service here
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://${req.headers.host}/reset-password/${resetToken}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error in forgot password process', error: error.message });
    }
});
router.get('/profile', auth, async (req, res) => {
    try {
        // Send back the logged-in user's data
        res.json({
            username: req.user.username,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to load profile data' });
    }
});
router.post('/change-password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Fetch the logged-in user
        const user = await User.findById(req.user._id);

        // Verify the old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        // Invalidate the current token by simply asking the user to log in again
        res.json({ message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }

        // Update the password and clear the token fields
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully. Please log in with your new password.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password. Please try again.' });
    }
});


module.exports = router;
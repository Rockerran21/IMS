const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.getProfile = async (req, res) => {
    try {
        res.json({
            username: req.user.username,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to load profile data' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.avatar = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
        await user.save();
        res.json({ message: 'Avatar uploaded successfully' });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAvatar = async (req, res) => {
    try {
        if (!req.params.id || req.params.id === 'undefined') {
            return res.status(400).send('Invalid user ID');
        }
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar || !user.avatar.data) {
            return res.status(404).send('Avatar not found');
        }
        res.set('Content-Type', user.avatar.contentType);
        res.send(user.avatar.data);
    } catch (error) {
        console.error('Error fetching avatar:', error);
        res.status(500).send('Server error');
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const { defaultDashboardView, notificationPreference } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.defaultDashboardView = defaultDashboardView;
        user.notificationPreference = notificationPreference;
        await user.save();
        res.json({ message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(10);
        console.log('Fetching activity logs for user:', req.user._id);
        console.log('Activity logs found:', activityLogs);
        res.json(activityLogs);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({ error: 'Failed to fetch activity log' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.username = username;
        user.email = email;
        user.phone = phone;
        await user.save();

        // Log the activity
        await ActivityLog.create({
            userId: user._id,
            action: 'Updated profile information'
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
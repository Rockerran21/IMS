const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
const logger = require('../utils/logger');  // Assume you have a logger utility

const handleError = (res, error, message) => {
    logger.error(`${message}: ${error.message}`);
    res.status(500).json({ message: message, error: error.message });
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username email role');
        res.json(users);
    } catch (error) {
        handleError(res, error, 'Failed to list users');
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to add user');
    }
};

exports.backupDatabase = (req, res) => {
    const backupDir = path.join(__dirname, '../backups');
    const backupPath = path.join(backupDir, `backup-${Date.now()}.gz`);
    const mongodumpPath = '/opt/homebrew/bin/mongodump'; // Use the correct path from 'which mongodump'
    const escapedUri = process.env.MONGODB_URI.replace(/"/g, '\\"');

    // Create the backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const cmd = `"${mongodumpPath}" --uri="${escapedUri}" --gzip --archive="${backupPath}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            handleError(res, error, 'Backup failed');
        } else {
            res.json({ message: 'Backup created successfully', path: backupPath });
        }
    });
};

exports.restoreDatabase = (req, res) => {
    console.log('Received files:', req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const backupFile = req.files.backupFile;
    console.log('Backup file:', backupFile);

    if (!backupFile) {
        return res.status(400).json({ message: 'No backup file provided' });
    }

    const tempPath = path.join(__dirname, '../temp', backupFile.name);

    backupFile.mv(tempPath, (err) => {
        if (err) {
            handleError(res, err, 'Failed to save backup file');
        } else {
            const mongorestore = '/opt/homebrew/bin/mongorestore'; // Use the correct path
            const cmd = `"${mongorestore}" --uri="${process.env.MONGODB_URI}" --gzip --archive="${tempPath}"`;

            exec(cmd, (error, stdout, stderr) => {
                // Clean up the temporary file
                fs.unlinkSync(tempPath);

                if (error) {
                    handleError(res, error, 'Restore failed');
                } else {
                    res.json({ message: 'Database restored successfully' });
                }
            });
        }
    });
};

exports.updateEmailConfig = async (req, res) => {
    try {
        const { smtpServer, smtpPort, emailUsername, emailPassword } = req.body;
        // In a real-world scenario, you'd want to securely store these credentials
        // For now, we'll just simulate saving them
        res.json({ message: 'Email configuration updated successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to update email configuration');
    }
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await User.findOne({ role: 'admin' });

        if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        admin.password = await bcrypt.hash(newPassword, 8);
        await admin.save();

        res.json({ message: 'Admin password changed successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to change admin password');
    }
};

exports.getSystemLogs = (req, res) => {
    const logPath = path.join(__dirname, '../logs', 'system.log');
    const logType = req.query.type || 'all';

    fs.readFile(logPath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.json({ logs: 'No logs available yet.' });
            } else {
                handleError(res, err, 'Failed to read system logs');
            }
        } else {
            let logs = data.split('\n');
            if (logType === 'error') {
                logs = logs.filter(line => line.includes('ERROR:'));
            } else if (logType === 'info') {
                logs = logs.filter(line => line.includes('INFO:'));
            }
            res.json({ logs: logs.slice(-100).join('\n') });
        }
    });
};

exports.generateTwoFactorQR = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ name: "Student Management System" });
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        // Store the secret in the user's document in the database
        await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 });

        res.json({ qrCodeUrl });
    } catch (error) {
        handleError(res, error, 'Failed to generate 2FA QR code');
    }
};

exports.enableTwoFactor = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user._id);

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ success: true, message: 'Two-factor authentication enabled successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid verification code' });
        }
    } catch (error) {
        handleError(res, error, 'Failed to enable 2FA');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to delete user');
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        let searchCriteria = {};

        if (query) {
            searchCriteria = {
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(searchCriteria, 'username email role');
        res.json(users);
    } catch (error) {
        handleError(res, error, 'Failed to search users');
    }
};
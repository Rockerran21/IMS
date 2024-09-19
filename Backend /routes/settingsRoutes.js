const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth } = require('../middleware/auth');

router.get('/users', auth, settingsController.listUsers);
router.post('/users', auth, settingsController.addUser);
router.post('/backup', auth, settingsController.backupDatabase);
router.post('/restore', auth, settingsController.restoreDatabase);
router.post('/email-config', auth, settingsController.updateEmailConfig);
router.post('/change-admin-password', auth, settingsController.changeAdminPassword);
router.get('/system-logs', auth, settingsController.getSystemLogs);
router.get('/generate-2fa-qr', auth, settingsController.generateTwoFactorQR);
router.post('/enable-2fa', auth, settingsController.enableTwoFactor);
router.delete('/users/:id', auth, settingsController.deleteUser);
router.get('/users/search', auth, settingsController.searchUsers);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to load profile data' });
    }
});
router.post('/change-password', auth, userController.changePassword);
router.post('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.get('/avatar/:id', userController.getAvatar);
router.post('/update-preferences', auth, userController.updatePreferences);
router.get('/activity-log', auth, userController.getActivityLog);
router.post('/update-profile', auth, userController.updateProfile);

module.exports = router;
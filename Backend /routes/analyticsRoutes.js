const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/analytics-data', analyticsController.getAnalyticsData);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyNotification,
    readNotifications
} = require('../controllers/notificationControllers');


router
    .get('/', protect, getMyNotification)
    .put('/read', protect, readNotifications)


module.exports = router;
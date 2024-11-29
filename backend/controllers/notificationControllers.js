const Notification = require('../models/notificationModel');


// @desc    Get all notifications for the logged in user
// @route   GET /api/notifications?limit=10&page=1
// @access  Private
const getMyNotification = async (req, res) => {
    try {
        let { limit, page } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const notifications = await Notification.find({ receiver: req.user._id })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 })
        .populate('sender', 'username avatar firstName lastName')

        return res.status(200).json({
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
const readNotifications = async (req, res) => {
    try {
        await Notification.updateMany({ receiver: req.user._id }, { read: true });

        return res.status(200).json({
            message: 'All notifications marked as read'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    getMyNotification,
    readNotifications
}
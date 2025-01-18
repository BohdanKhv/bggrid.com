const Notification = require('../models/notificationModel');


// @desc    Get all notifications for the logged in user
// @route   GET /api/notifications?limit=10&page=1
// @access  Private
const getMyNotification = async (req, res) => {
    try {
        let { limit, page } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const notifications = await Notification
        .paginate({ receiver: req.user._id }, { limit, page, sort: { createdAt: -1 }, populate: 'sender', select: '-receiver' });

        return res.status(200).json({
            data: notifications.docs,
            currentPage: notifications.page,
            totalPages: notifications.totalPages,
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
const User = require('../models/userModel');
const Follow = require('../models/followModel');
const Notification = require('../models/notificationModel');


// @desc    Get followers
// @route   GET /api/follow?page=n&limit=n
// @access  Public
const getFollowers =


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
};
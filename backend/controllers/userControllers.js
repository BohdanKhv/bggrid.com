const User = require('../models/userModel');



// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await
        User.findOne({
            username: { $regex: req.params.username, $options: 'i' }
        })
        .select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        data: user
    });
};


// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
    const { q } = req.query;

    const users = await User.find({
        $or: [
            {username: { $regex: q, $options: 'i' }},
            {firstName: { $regex: q, $options: 'i' }},
            {lastName: { $regex: q, $options: 'i' }}
        ],
        _id: { $ne: req.user._id }
    })
    .limit(10)
    .select('-password');

    res.status(200).json({
        data: users
    });
};


module.exports = {
    getUserProfile,
    searchUsers
};
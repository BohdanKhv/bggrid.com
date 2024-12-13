const User = require('../models/userModel');
const Play = require('../models/playModel');
const Library = require('../models/libraryModel');
const Follow = require('../models/followModel');



// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await
        User.findOne({
            username: { $regex: req.params.username, $options: 'i' }
        })
        .select('-password');

        const allLibrary = await Library.find({ user: user._id })
        .populate('game', 'name thumbnail')

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user._id.toString() !== req.user?._id?.toString()) {
            const follow = await Follow.findOne({
                follower: req.user._id,
                following: user._id
            });

            user.isFollowing = follow ? true : false;
        }

        res.status(200).json({
            data: {
                ...user._doc,
                library: allLibrary
            }
        });
    } catch (error) {
        res.status(404);
        return res.json({ msg: error.message });
    }
};


// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
    const { q } = req.query;

    try {
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
    } catch (error) {
        res.status(404);
        throw new Error('No users found');
    }
};


module.exports = {
    getUserProfile,
    searchUsers
};
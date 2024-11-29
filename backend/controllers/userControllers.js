const User = require('../models/userModel');
const Play = require('../models/playModel');
const Library = require('../models/libraryModel');
const Friend = require('../models/friendModel');



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

        const totalPlays = await Play.countDocuments({
            $or: [
                { user: user._id },
                { 'players.user': user._id }
            ]
        });
        const allLibrary = await Library.find({ user: user._id })
        .populate('game', 'name thumbnail')
        let allFriends = await Friend.find({
            $or: [
                { user1: user._id },
                { user2: user._id }
            ],
            pending: false
        })
        .populate('user1', 'username avatar firstName lastName')
        .populate('user2', 'username avatar firstName lastName');

        allFriends = allFriends.map(friend => {
            if (friend.user1._id.toString() === user._id.toString()) {
                return {
                    ...friend.user2._doc,
                }
            } else {
                return {
                    ...friend.user1._doc,
                }
            }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({
            data: {
                ...user._doc,
                friends: allFriends,
                plays: totalPlays,
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
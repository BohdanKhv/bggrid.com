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
            username: { $regex: `^${req.params.username}$`, $options: 'i' }
        })
        .select('avatar username firstName lastName followers following bggUsername bio'); 

        if (!user) {
            return res.status(404).json({ msg: '404' });
        }

        const allLibrary = await Library.find({ user: user._id })
        .populate('game', 'name thumbnail')

        let isFollowing = false
        if (req.user) {
            isFollowing = await Follow.findOne({
                follower: req.user._id,
                following: user._id
            });
        }


        res.status(200).json({
            data: {
                ...user._doc,
                isFollowing: isFollowing ? true : false,
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
    const { q, checkIsFollowing } = req.query;

    try {
        let users = await User.find({
            $or: [
                {username: { $regex: q, $options: 'i' }},
                {firstName: { $regex: q, $options: 'i' }},
                {lastName: { $regex: q, $options: 'i' }}
            ],
            _id: { $ne: req.user._id }
        })
        .limit(10)
        .select('username firstName lastName avatar');

        let data = []

        if (checkIsFollowing) {
            const isFollowing = await Follow.find({ follower: req.user._id, following: { $in: users.map(user => user._id) } });
            // Set isFollowing to true if user is already followed
            users.forEach(user => {
                const follow = isFollowing.find(follow => follow.following.toString() === user._id.toString());
                
                return data.push({
                    ...user._doc,
                    isFollowing: follow ? true : false
                });
            });
        } else {
            data = users
        }

        res.status(200).json({
            data: data
        });
    } catch (error) {
        res.status(404);
        return res.json({ msg: error.message });
    }
};


module.exports = {
    getUserProfile,
    searchUsers
};
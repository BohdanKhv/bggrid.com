const User = require('../models/userModel');
const Follow = require('../models/followModel');
const Notification = require('../models/notificationModel');


// @desc    Get followers
// @route   GET /api/follow/followers/:userId?page=n&limit=n
// @access  Public
const getFollowers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { numRatings: -1},
            populate: { path: 'follower', select: 'username avatar firstName lastName' }
        };

        let followers = await Follow.paginate({
            following: req.params.userId 
        }, options)

        followers = followers.docs.map(u => u.follower);

        // Check if user is already followed
        let data = []
        if (req.user) {
            const isFollowing = await Follow.find({ follower: req.user._id, following: { $in: followers.map(user => user._id) } });
            // Set isFollowing to true if user is already followed
            followers.forEach(user => {
                const follow = isFollowing.find(follow => follow.following.toString() === user._id.toString());
                
                return data.push({
                    ...user._doc,
                    isFollowing: follow ? true : false
                });
            });
        } else {
            data = followers;
        }

        // Get current page and total pages
        const currentPage = followers.page;
        const totalPages = followers.totalPages;
    
        res.status(200).json({
            data: data,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get following
// @route   GET /api/follow/following/:userId?page=n&limit=n
// @access  Public
const getFollowing = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { numRatings: -1},
            populate: { path: 'following', select: 'username avatar firstName lastName' }
        };

        let following = await Follow.paginate({
            follower: req.params.userId 
        }, options)

        following = following.docs.map(u => u.following);

        let data = []
        if (req.user) {

            const isFollowing = await Follow.find({ follower: req.user._id, following: { $in: following.map(user => user._id) } });
            // Set isFollowing to true if user is already followed
            following.forEach(user => {
                const follow = isFollowing.find(follow => follow.following.toString() === user._id.toString());
                
                return data.push({
                    ...user._doc,
                    isFollowing: follow ? true : false
                });
            });
        } else {
            data = following;
        }

        // Get current page and total pages
        const currentPage = following.page;
        const totalPages = following.totalPages;

        res.status(200).json({
            data: data,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Follow a user
// @route   POST /api/follow/follow/:userId
// @access  Private
const followUser = async (req, res) => {
    try {
        const me = await User.findById(req.user._id);
        const user = await User.findById(req.params.userId)
        .select('following followers avatar firstName lastName username');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.user._id.toString() === req.params.userId) {
            return res.status(400).json({ msg: 'You cannot follow yourself' });
        }

        const follow = await Follow.findOne({ follower: req.user._id, following: req.params.userId });
        if (follow) {
            return res.status(400).json({ msg: 'Already following this user' });
        }

        const newFollow = new Follow({
            follower: req.user._id,
            following: req.params.userId
        });

        await newFollow.save();

        // Create notification
        const notification = new Notification({
            receiver: req.params.userId,
            sender: req.user._id,
            message: `${req.user.username} started following you`,
            type: 'follow',
            read: false
        });

        await notification.save();

        user.followers += 1;
        me.following += 1;
        await user.save();
        await me.save();

        return res.status(201).json({
            data: {
                ...user._doc,
                isFollowing: true
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Unfollow a user
// @route   DELETE /api/follow/:userId/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
    try {
        const me = await User.findById(req.user._id);
        const user = await User.findById(req.params.userId)
        .select('following followers avatar firstName lastName username');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.user._id === req.params.userId) {
            return res.status(400).json({ msg: 'You cannot unfollow yourself' });
        }

        const follow = await Follow.findOne({ follower: req.user._id, following: req.params.userId });
        if (!follow) {
            return res.status(400).json({ msg: 'Not following this user' });
        }

        await follow.deleteOne();

        user.followers -= 1;
        me.following -= 1;
        await user.save();
        await me.save();

        return res.status(200).json({
            data: {
                ...user._doc,
                isFollowing: false
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
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
        if (req.user) {
            const isFollowing = await Follow.find({ follower: req.user._id, following: req.params.userId });


            followers.docs.forEach(follower => {
                const follow = isFollowing.find(follow => follow.follower.toString() === follower._id.toString());
                if (follow) {
                    follower.isFollowing = true;
                } else {
                    follower.isFollowing = false;
                }
            });
        }

        // Get current page and total pages
        const currentPage = followers.page;
        const totalPages = followers.totalPages;
    
        res.status(200).json({
            data: followers,
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

        // check if user is already followed
        if (req.user) {
            const isFollowing = await Follow.find({ follower: req.user._id, following: req.params.userId });
            following.docs.forEach(follow => {
                const isFollow = isFollowing.find(follow => follow.following.toString() === follow._id.toString());
                if (isFollow) {
                    follow.isFollowing = true;
                } else {
                    follow.isFollowing = false;
                }
            });
        }

        // Get current page and total pages
        const currentPage = following.page;
        const totalPages = following.totalPages;

        res.status(200).json({
            data: following,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Follow a user
// @route   POST /api/follow/:userId/follow
// @access  Private
const followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.user._id === req.params.userId) {
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
            type: 'follow',
            read: false
        });

        await notification.save();

        user.followersCount += 1;
        req.user.followingCount += 1;
        await user.save();
        await req.user.save();

        return res.status(201).json({
            data: newFollow
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
        const user = await User.findById(req.params.userId);
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

        await follow.remove();

        user.followersCount -= 1;
        req.user.followingCount -= 1;
        await user.save();
        await req.user.save();

        return res.status(200).json({
            data: {
                _id: follow._id,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Search users and give check if user is already followed or not. Set isFollowing to true if user is already followed
// @route   GET /api/follow/search
// @access  Private
const searchUsersToFollow = async (req, res) => {
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

        // Check if user is already followed
        const isFollowing = await Follow.find({ follower: req.user._id, following: { $in: users.map(user => user._id) } });

        // Set isFollowing to true if user is already followed
        users.forEach(user => {
            const follow = isFollowing.find(follow => follow.following.toString() === user._id.toString());
            if (follow) {
                user.isFollowing = true;
            } else {
                user.isFollowing = false;
            }
        });

        res.status(200).json({
            data: users
        });
    } catch (error) {
        res.status(404);
        throw new Error('No users found');
    }
};


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    searchUsersToFollow
};
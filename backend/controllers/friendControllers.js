const User = require('../models/userModel');
const Friend = require('../models/friendModel');


// @desc    Get my friends
// @route   GET /api/friends
// @access  Private
const getMyFriends = async (req, res) => {
    try {
        const friends = await Friend.find({
            $or: [
                { user: req.user._id },
                { friend: req.user._id }
            ],
        })
        .populate('user', 'username avatar firstName lastName')
        .populate('friend', 'username avatar firstName lastName')

        // return friend as not me (user)
        // because if someone sends me a friend request, I will see myself as a friend

        const friendList = friends.map(friend => {
            if (friend.user._id.toString() === req.user._id.toString()) {
                return {
                    friend: friend.friend._doc,
                    _id: friend._id,
                    pending: friend.pending
                }
            } else {
                return {
                    friend: friend.user._doc,
                    _id: friend._id,
                    pending: friend.pending
                }
            }
        });

        res.status(200).json({
            data: friendList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Send a friend request
// @route   POST /api/friends/send/:userId
// @access  Private
const sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('avatar username firstName lastName');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(400).json({ msg: 'You cannot send a friend request to yourself' });
        }

        const friend = await Friend.findOne({
            user: req.user._id,
            friend: req.params.userId
        });

        if (friend) {
            return res.status(400).json({ msg: 'Friend request already sent' });
        }

        const newFriend = new Friend({
            user: req.user._id,
            friend: user,
            pending: true
        });

        await newFriend.save();

        // populate friend field with username
        await newFriend.populate([
            { path: 'user', select: 'avatar username firstName lastName' },
        ])

        res.status(201).json({
            data: newFriend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Accept a friend request
// @route   PUT /api/friends/accept/:inviteId
// @access  Private
const acceptFriendRequest = async (req, res) => {
    try {
        const friend = await Friend.findOne({
            _id: req.params.inviteId,
            friend: req.user._id,
            pending: true
        });

        if (!friend) {
            return res.status(404).json({ msg: 'Friend request not found' });
        }

        friend.pending = false;
        await friend.save();

        res.status(200).json({
            data: friend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Decline a friend request
// @route   POST /api/friends/decline/:inviteId
// @access  Private
const declineFriendRequest = async (req, res) => {
    try {
        const friend = await Friend.findOne({
            _id: req.params.inviteId,
            friend: req.user._id,
            pending: true
        });

        if (!friend) {
            return res.status(404).json({ msg: 'Friend request not found' });
        }

        await friend.remove();

        res.status(200).json({
            data: friend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Remove a friend
// @route   DELETE /api/friends/remove/:inviteId
// @access  Private
const removeFriend = async (req, res) => {
    try {
        const friend = await Friend.findOne({
            _id: req.params.inviteId,
            $or: [
                { user: req.user._id },
                { friend: req.user._id }
            ],
        });

        if (!friend) {
            return res.status(404).json({ msg: 'Friend not found' });
        }

        await friend.deleteOne();

        res.status(200).json({
            data: friend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
};
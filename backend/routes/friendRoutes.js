const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getMyFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUsers,
} = require('../controllers/friendControllers.js');


router
    .get('/', protect, getMyFriends)
    .get('/requests', protect, getFriendRequests)
    .post('/send', protect, sendFriendRequest)
    .post('/accept', protect, acceptFriendRequest)
    .post('/decline', protect, declineFriendRequest)
    .post('/remove', protect, removeFriend)
    .get('/search', protect, searchUsers)


module.exports = router;
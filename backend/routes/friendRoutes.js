const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
} = require('../controllers/friendControllers.js');


router
    .get('/', protect, getMyFriends)
    .post('/send/:userId', protect, sendFriendRequest)
    .post('/accept/:inviteId', protect, acceptFriendRequest)
    .post('/remove/:inviteId', protect, removeFriend)


module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} = require('../controllers/followControllers.js');


router
    .post('/follow/:userId', protect, followUser)
    .delete('/unfollow/:userId', protect, unfollowUser)
    .get('/followers/:userId', loggedIn, getFollowers)
    .get('/following/:userId', loggedIn, getFollowing)


module.exports = router;
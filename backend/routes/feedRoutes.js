const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getCommunityFeedForYou,
    getCommunityFeed,
    getHomeFeed,
    getGeneralHomeFeed
} = require('../controllers/feedControllers.js');


router
    .get('/community-for-you', protect, getCommunityFeedForYou)
    .get('/general-home', getGeneralHomeFeed)
    .get('/home', protect, getHomeFeed)
    .get('/community', protect, getCommunityFeed)


module.exports = router;
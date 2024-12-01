const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getCommunityFeed,
    getHomeFeed
} = require('../controllers/feedControllers.js');


router
    .get('/home', protect, getHomeFeed)
    .get('/community', protect, getCommunityFeed)


module.exports = router;
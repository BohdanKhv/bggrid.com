const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getCommunityFeed,
    getHomeFeed
} = require('../controllers/communityControllers.js');


router
    .get('/community', protect, getCommunityFeed)
    .get('/home', protect, getHomeFeed);


module.exports = router;
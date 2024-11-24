const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getCommunityFeed,
} = require('../controllers/communityControllers.js');


router
    .get('/community', protect, getCommunityFeed)


module.exports = router;
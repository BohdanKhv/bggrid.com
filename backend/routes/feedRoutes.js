const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getCommunityFeed,
} = require('../controllers/feedControllers.js');


router
    .get('/community', protect, getCommunityFeed)


module.exports = router;
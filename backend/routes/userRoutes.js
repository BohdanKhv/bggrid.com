const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    searchUsers
} = require('../controllers/userControllers');


router
    .get('/search', protect, searchUsers)
    .get('/:username', loggedIn, getUserProfile)


module.exports = router;
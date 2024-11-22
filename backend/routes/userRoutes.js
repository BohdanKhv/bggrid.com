const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    searchUsers
} = require('../controllers/userControllers');


router
    .get('/search', protect, searchUsers)
    .get('/:username', getUserProfile)


module.exports = router;
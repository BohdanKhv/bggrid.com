const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    searchUsers
} = require('../controllers/userControllers');


router
    .get('/username', getUserProfile)
    .get('/search', protect, searchUsers);


module.exports = router;
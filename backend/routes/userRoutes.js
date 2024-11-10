const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserProfile
} = require('../controllers/userControllers');


router
    .get('/username', getUserProfile)


module.exports = router;
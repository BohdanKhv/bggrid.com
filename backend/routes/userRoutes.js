const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMe,
    sendLoginEmail,
    login,
    register,
    updateUser,
} = require('../controllers/userControllers');


router
    .get('/me', protect, getMe)
    .post('/get-login-link', sendLoginEmail)
    .post('/login', login)
    .post('/', register)
    .put('/', protect, updateUser);


module.exports = router;
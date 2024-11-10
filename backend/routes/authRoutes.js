const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMe,
    sendLoginEmail,
    login,
    register,
    updateUser,
    forgotPassword,
    resetPassword
} = require('../controllers/authControllers');


router
    .get('/me', protect, getMe)
    .post('/get-login-link', sendLoginEmail)
    .post('/login', login)
    .post('/forgot-password', forgotPassword)
    .post('/reset-password', resetPassword)
    .post('/', register)
    .put('/', protect, updateUser);


module.exports = router;
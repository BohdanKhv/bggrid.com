const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    continueWithGoogle,
    getMe,
    login,
    register,
    updateUser,
    forgotPassword,
    resetPassword
} = require('../controllers/authControllers');


router
    .post('/google', continueWithGoogle)
    .get('/me', protect, getMe)
    .post('/login', login)
    .post('/forgot-password', forgotPassword)
    .post('/reset-password', resetPassword)
    .post('/', register)
    .put('/', protect, upload.single('avatar'), updateUser);


module.exports = router;
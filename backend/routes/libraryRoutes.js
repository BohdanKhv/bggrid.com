const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyLibrary,
} = require('../controllers/libraryControllers');


router
    .get('/my-library', protect, getMyLibrary)


module.exports = router;
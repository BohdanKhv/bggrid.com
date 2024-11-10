const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyLibrary,
    addGameToLibrary,
    removeGameFromLibrary
} = require('../controllers/libraryControllers');


router
    .get('/my-library', protect, getMyLibrary)
    .post('/', protect, addGameToLibrary)
    .delete('/:id', protect, removeGameFromLibrary)


module.exports = router;
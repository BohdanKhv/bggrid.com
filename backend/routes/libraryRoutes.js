const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyLibrary,
    addGameToLibrary,
    updateGameInLibrary,
    removeGameFromLibrary,
    getReviewsByGame
} = require('../controllers/libraryControllers');


router
    .get('/my-library', protect, getMyLibrary)
    .get('/reviews/:gameId', getReviewsByGame)
    .post('/', protect, addGameToLibrary)
    .put('/:gameId', protect, updateGameInLibrary)
    .delete('/:gameId', protect, removeGameFromLibrary)


module.exports = router;
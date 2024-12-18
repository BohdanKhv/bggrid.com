const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyLibrary,
    addGameToLibrary,
    updateGameInLibrary,
    removeGameFromLibrary,
    getReviewsByGame,
    getGameStats,
    importBggCollection
} = require('../controllers/libraryControllers');


router
    .get('/my-library', protect, getMyLibrary)
    .get('/stats/:gameId', getGameStats)
    .get('/reviews/:gameId', getReviewsByGame)
    .post('/', protect, addGameToLibrary)
    .put('/:gameId', protect, updateGameInLibrary)
    .delete('/:gameId', protect, removeGameFromLibrary)
    .post('/import-bgg-collection', protect, importBggCollection);


module.exports = router;
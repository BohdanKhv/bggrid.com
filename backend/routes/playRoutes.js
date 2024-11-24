const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyPlays,
    getPlaysByGame,
    getGameStats,
    createPlay,
    getPlayById,
    updatePlay,
    deletePlay,
} = require('../controllers/playControllers');


router
    .get('/my-plays', protect, getMyPlays)
    .get('/game/:gameId', getPlaysByGame)
    .get('/stats/:gameId', getGameStats)
    .get('/:playId', getPlayById)
    .put('/:playId', protect, updatePlay)
    .post('/', protect, createPlay)
    .delete('/:playId', protect, deletePlay)


module.exports = router;
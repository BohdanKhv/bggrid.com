const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyPlays,
    getPlaysByGame,
    createPlay,
    deletePlay,
} = require('../controllers/playControllers');


router
    .get('/my-plays', protect, getMyPlays)
    .get('/game/:gameId', getPlaysByGame)
    .post('/', protect, createPlay)
    .delete('/:playId', protect, deletePlay)


module.exports = router;
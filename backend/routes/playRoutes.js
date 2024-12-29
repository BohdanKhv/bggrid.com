const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    getMyPlays,
    getPlaysByGame,
    getPlaysByUsername,
    getGameStats,
    createPlay,
    getPlayById,
    updatePlay,
    deletePlay,
} = require('../controllers/playControllers');


router
    .get('/my-plays', protect, getMyPlays)
    .get('/game/:gameId', getPlaysByGame)
    .get('/username/:username', getPlaysByUsername)
    .get('/stats/:gameId', getGameStats)
    .get('/:playId', getPlayById)
    .put('/:playId', protect, updatePlay)
    .post('/', protect, upload.single('image'), createPlay)
    .delete('/:playId', protect, deletePlay)


module.exports = router;
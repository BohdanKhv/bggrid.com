const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getGames,
    getGameById,
} = require('../controllers/gameControllers');


router
    .get('/', getGames)
    .get('/:id', getGameById)


module.exports = router;
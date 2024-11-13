const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getGames,
    getSuggestions,
    getGameById,
} = require('../controllers/gameControllers');


router
    .get('/', getGames)
    .get('/suggestions', getSuggestions)
    .get('/:id', getGameById)


module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getGames,
    getSuggestions,
    getGameById,
    getGameOverview,
} = require('../controllers/gameControllers');


router
    .get('/', loggedIn, getGames)
    .get('/suggestions', getSuggestions)
    .get('/:gameId/overview', getGameOverview)
    .get('/:id', getGameById)


module.exports = router;
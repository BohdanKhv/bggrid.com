const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getGamesByPublisherId,
    getGames,
    getSuggestions,
    getGameById,
    getGameOverview,
} = require('../controllers/gameControllers');


router
    .get('/publisher/:publisherId', getGamesByPublisherId)
    .get('/', loggedIn, getGames)
    .get('/suggestions', getSuggestions)
    .get('/:gameId/overview', getGameOverview)
    .get('/:id', getGameById)


module.exports = router;
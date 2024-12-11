const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getGamesByPublisherId,
    getGamesByPersonId,
    getGames,
    getSuggestions,
    getGameById,
    getGameOverview,
} = require('../controllers/gameControllers');


router
    .get('/publisher/:publisherId', getGamesByPublisherId)
    .get('/person/:personId', getGamesByPersonId)
    .get('/', loggedIn, getGames)
    .get('/suggestions', getSuggestions)
    .get('/:gameId/overview', getGameOverview)
    .get('/:id', getGameById)


module.exports = router;
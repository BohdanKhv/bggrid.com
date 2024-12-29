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
    getHotGames,
    getTrendingGames,
    getMostPlayedGames,
    getBestsellerGames
} = require('../controllers/gameControllers');


router
    .get('/collection/hot', getHotGames)
    .get('/collection/trending', getTrendingGames)
    .get('/collection/most-played', getMostPlayedGames)
    .get('/collection/bestseller', getBestsellerGames)
    .get('/publisher/:publisherId', getGamesByPublisherId)
    .get('/person/:personId', getGamesByPersonId)
    .get('/', loggedIn, getGames)
    .get('/suggestions', getSuggestions)
    .get('/:gameId/overview', getGameOverview)
    .get('/:id', getGameById)


module.exports = router;
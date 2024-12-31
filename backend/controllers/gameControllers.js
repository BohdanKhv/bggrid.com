const Game = require('../models/gameModel');
const Play = require('../models/playModel');
const Library = require('../models/libraryModel');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');


// @desc    Get games by publisher id
// @route   GET /api/games/publisher/:publisherId
// @access  Public
const getGamesByPublisherId = async (req, res) => {
    try {
        const { page, limit } = req.query;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { numRatings: -1},
            populate: 'publishers',
            select: 'name thumbnail image year numRatings rating complexityWeight minPlayers maxPlayers minPlaytime maxPlaytime'
        };

        if (options.limit > 50) options.limit = 50;

        const games = await Game.paginate({ publishers:
            new mongoose.Types.ObjectId(req.params.publisherId)
        }, options)

        // Get current page and total pages
        const currentPage = games.page;
        const totalPages = games.totalPages;
    
        res.status(200).json({
            data: games.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get games by person id
// @route   GET /api/games/person/:personId
// @access  Public
const getGamesByPersonId = async (req, res) => {
    try {
        const { page, limit } = req.query;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { numRatings: -1},
            populate: 'publishers',
            select: 'name thumbnail image year numRatings rating complexityWeight minPlayers maxPlayers minPlaytime maxPlaytime'
        };

        if (options.limit > 50) options.limit = 50;

        const games = await Game.paginate({ 
            $or: [
                { artists: new mongoose.Types.ObjectId(req.params.personId) },
                { designers: new mongoose.Types.ObjectId(req.params.personId) },
            ]
        }, options)

        // Get current page and total pages
        const currentPage = games.page;
        const totalPages = games.totalPages;
    
        res.status(200).json({
            data: games.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



// @desc    Get games
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const { mechanics, types, themes, publisherId, players, minWeight, maxWeight, minYear, maxYear } = req.query;
        const { sort, sortOrder } = req.query;

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { numRatings: -1},
            populate: 'publishers',
            select: 'name thumbnail image year numRatings rating complexityWeight minPlayers maxPlayers minPlaytime maxPlaytime'
        };

        if (options.limit > 50) options.limit = 50;

        if (sort) {
            if (sort === 'relevance') { options.sort = { name: sortOrder === 'asc' ? 1 : -1 } }
            if (sort === 'most-popular') { options.sort = { numRatings: sortOrder === 'asc' ? 1 : -1 } }
            if (sort === 'complexity') { options.sort = { complexityWeight: sortOrder === 'asc' ? 1 : -1 } }
            if (sort === 'new-releases') { options.sort = { year: sortOrder === 'asc' ? 1 : -1 } }
        }

        const { s, hideInLibrary } = req.query;

        const q = {}

        if (s && s.length > 0) { q.name = { $regex: new RegExp(s.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().split(' ').join('.*'), 'i') } }

        const cats = []
        
        if (types && types.length > 0) cats.push(...types.split(','))
        if (mechanics && mechanics.length > 0) cats.push(...mechanics.split(','))
        if (themes && themes.length > 0) cats.push(...themes.split(','))

        if (cats && cats.length > 0) {
            // console.log(cats)
            q.$or = [
                { themes: { $in: cats.map(theme => new RegExp(theme, 'i')) } },
                { mechanics: { $in: cats.map(theme => new RegExp(theme, 'i')) } },
                { types: { $in: cats.map(theme => new RegExp(theme, 'i')) } },
                { categories: { $in: cats.map(theme => new RegExp(theme, 'i')) } }
            ]
        }
        if (players && players.length > 0) {
            const min = players.split('-')[0] || 0;
            const max = players.split('-')[1] || min || 100;
            q.minPlayers = { $gte: min };
            q.maxPlayers = { $lte: max };
        }
        if (minYear || maxYear) { q.year = { $gte: minYear || 0, $lte: maxYear || new Date().getFullYear() } }

        if (minWeight || maxWeight) { q.complexityWeight = { $gte: minWeight || 0, $lte: maxWeight || 5 } }

        if (hideInLibrary) {
            const myLibrary = await Library.find({ user: req.user._id }).select('game');
            const gameIds = myLibrary.map(item => item.game._id);
            q._id = { $nin: gameIds };
        }

        const games = await Game.paginate(q, options)
        
        // Get current page and total pages
        const currentPage = games.page;
        const totalPages = games.totalPages;
        
        // console.log(`Current Page: ${currentPage}`);
        // console.log(`Total Pages: ${totalPages}`);
        // console.log(`Total Docs: ${games.docs.length}`);

        res.status(200).json({
            data: games.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get games
// @route   GET /api/games/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
    try {
        const { s } = req.query;
        const games = await Game.find({
            name: { 
            $regex: new RegExp(s.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().split(' ').join('.*'), 'i')
            }
        })
        .sort({ rating: -1, year: -1 })
        .limit(15)
        .select({ name: 1, thumbnail: 1, year: 1 });

        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

// @desc    Create a new game
// @route   POST /api/games
// @access  Private
const createGame = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        const game = await Game.create({
            title,
            description,
            verified: false
        });

        res.status(201).json({
            data: game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get a game by id
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ msg: '404' });
        }

        res.status(200).json({
            data: game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc   Get game stats
// @route  GET /api/games/:gameId/overview
// @access Public
const getGameOverview = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId)
        .populate('publishers')
        .populate('designers')
        .populate('artists')

        if (!game) {
            return res.status(404).json({ msg: '404' });
        }

        const playStats = await Play.aggregate([
            { $match: { game: game._id } },
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: 1 },
                    avgPlayTime: { $avg: '$playTimeMinutes' },
                    avgPlayers: { $avg: { $size: '$players' } },
                    // avgWinRate: { $avg: { $cond: { if: { $arrayElemAt: ['$players.winner', 0] }, then: 1, else: 0 } } },
                    avgScore: { $avg: { $avg: '$players.score' } }
                }
            }
        ]);
        const reviewStats = await Library.aggregate([
            { $match: { game: game._id } },
            { $project: { rating: 1, tags: 1 } }, // Project fields to verify the match stage
            {
                $group: {
                    _id: null,
                    // only if rating is not null or 0
                    totalReviews: { $sum: 1 },
                    avgRating: { $avg: { $cond: { if: { $gt: ['$rating', 0] }, then: '$rating', else: null } } },
                    total1Star: { $sum: { $cond: { if: { $and: [{ $gte: ['$rating', 0.01] }, { $lte: ['$rating', 1.99] }] }, then: 1, else: 0 } } },
                    total2Star: { $sum: { $cond: { if: { $and: [{ $gt: ['$rating', 2] }, { $lte: ['$rating', 2.99] }] }, then: 1, else: 0 } } },
                    total3Star: { $sum: { $cond: { if: { $and: [{ $gt: ['$rating', 3] }, { $lte: ['$rating', 3.99] }] }, then: 1, else: 0 } } },
                    total4Star: { $sum: { $cond: { if: { $and: [{ $gt: ['$rating', 4] }, { $lte: ['$rating', 4.99] }] }, then: 1, else: 0 } } },
                    total5Star: { $sum: { $cond: { if: { $and: [{ $eq: ['$rating', 5] }] }, then: 1, else: 0 } } },
                    totalFavorites: { $sum: { $cond: { if: { $in: ['Favorite', '$tags'] }, then: 1, else: 0 } } },
                    totalOwned: { $sum: { $cond: { if: { $in: ['Owned', '$tags'] }, then: 1, else: 0 } } },
                    totalPlayed: { $sum: { $cond: { if: { $in: ['Played', '$tags'] }, then: 1, else: 0 } } },
                    totalWishlist: { $sum: { $cond: { if: { $in: ['Wishlist', '$tags'] }, then: 1, else: 0 } } },
                    totalWantToPlay: { $sum: { $cond: { if: { $in: ['Want to Play', '$tags'] }, then: 1, else: 0 } } },
                }
            }
        ]);

        const last3Plays = await Play.find({
            game: req.params.gameId,
            playTimeMinutes: { $gt: 0 },
            players: { $exists: true, $not: { $size: 0 } },
            comment: { $exists: true }
        }).sort({ createdAt: -1 }).limit(3).populate('players.user user', 'username firstName lastName avatar');
        const last3Reviews = await Library.find({
            game: req.params.gameId,
            rating: { $gt: 0 },
            comment: { $exists: true }
        }).sort({ createdAt: -1 }).limit(3).populate('user', 'username firstName lastName avatar');

        const images = []
        
        try {
            const response = await axios.get(`https://api.geekdo.com/api/images?ajax=1&foritempage=1&galleries%5B%5D=game&nosession=1&objecttype=thing&showcount=15&size=crop100&sort=hot&objectid=${game.bggId}`);

            response.data.images
            .map(image => {
                images.push({
                    image: image.imageurl_lg,
                    caption: image.caption,
                });
            });
        } catch (error) {
            console.log('Error', error);
        }

        const videos = []

        try {
            const response = await axios.get(`https://api.geekdo.com/api/videos?ajax=1&gallery=all&languageid=2184&nosession=1&objecttype=thing&showcount=15&sort=hot&objectid=${game.bggId}`);

            response.data.videos
            .map(video => {
                videos.push({
                    thumbnail: video?.images?.thumb,
                    title: video.title,
                    postedDate: new Date(video.postdate),
                    category: video.gallery,
                    videoId: video.extvideoid,
                });
            });
        } catch (error) {
            console.log('Error', error);
        }
        

        res.status(200).json({
            data: {
                ...game._doc,
                last3Plays,
                last3Reviews,
                playStats: playStats[0],
                reviewStats: reviewStats[0],
                images,
                videos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



// @desc    Get hot games
// @route   GET /api/games/hot
// @access  Public
const getHotGames = async (req, res) => {
    try {
        const url = 'https://api.geekdo.com/api/hotness?geeksite=boardgame&objecttype=thing&showcount=50';

        const response = await axios.get(url);

        const bggIds = [];

        response.data.items.map(item => {
            bggIds.push(item.objectid);
        });
        

        const games = await Game.aggregate([
            { $match: { bggId: { $in: bggIds } } },
            { $addFields: { order: { $indexOfArray: [bggIds, "$bggId"] } } },
            { $sort: { order: 1 } },
            { $lookup: {
                from: 'publishers', // The collection to join
                localField: 'publishers', // The field from the input documents
                foreignField: '_id', // The field from the documents of the "from" collection
                as: 'publishers' // The name of the new array field to add to the input documents
            }},
            { $project: { name: 1, thumbnail: 1, image: 1, year: 1, rating: 1, numRatings: 1, publishers: { name: 1 } } },
            { $limit: 50 }
        ]);

        // console.log(games.length);

        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



// @desc    Get hot games
// @route   GET /api/games/hot
// @access  Public
const getTrendingGames = async (req, res) => {
    try {
        const url = 'https://api.geekdo.com/api/trends/plays_delta?interval=month';

        const response = await axios.get(url);

        const bggIds = [];

        response.data.items.map(item => {
            bggIds.push(item?.item?.id);
        });
        

        const games = await Game.aggregate([
            { $match: { bggId: { $in: bggIds } } },
            { $addFields: { order: { $indexOfArray: [bggIds, "$bggId"] } } },
            { $sort: { order: 1 } },
            { $lookup: {
                from: 'publishers', // The collection to join
                localField: 'publishers', // The field from the input documents
                foreignField: '_id', // The field from the documents of the "from" collection
                as: 'publishers' // The name of the new array field to add to the input documents
            }},
            { $project: { name: 1, thumbnail: 1, image: 1, year: 1, rating: 1, numRatings: 1, publishers: { name: 1 } } },
            { $limit: 50 }
        ]);

        // console.log(games.length);
        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



// @desc    Get hot games
// @route   GET /api/games/hot
// @access  Public
const getMostPlayedGames = async (req, res) => {
    try {
        const url = 'https://api.geekdo.com/api/trends/plays?interval=month';

        const response = await axios.get(url);

        const bggIds = [];

        response.data.items.map(item => {
            bggIds.push(item?.item?.id);
        });
        

        const games = await Game.aggregate([
            { $match: { bggId: { $in: bggIds } } },
            { $addFields: { order: { $indexOfArray: [bggIds, "$bggId"] } } },
            { $sort: { order: 1 } },
            { $lookup: {
                from: 'publishers', // The collection to join
                localField: 'publishers', // The field from the input documents
                foreignField: '_id', // The field from the documents of the "from" collection
                as: 'publishers' // The name of the new array field to add to the input documents
            }},
            { $project: { name: 1, thumbnail: 1, image: 1, year: 1, rating: 1, numRatings: 1, publishers: { name: 1 } } },
            { $limit: 50 }
        ]);

        // console.log(games.length);
        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}




// @desc    Get hot games
// @route   GET /api/games/hot
// @access  Public
const getBestsellerGames = async (req, res) => {
    try {
        const url = 'https://api.geekdo.com/api/trends/ownership?interval=week';

        const response = await axios.get(url);

        const bggIds = [];

        response.data.items.map(item => {
            bggIds.push(item?.item?.id);
        });

        const games = await Game.aggregate([
            { $match: { bggId: { $in: bggIds } } },
            { $addFields: { order: { $indexOfArray: [bggIds, "$bggId"] } } },
            { $sort: { order: 1 } },
            { $lookup: {
                from: 'publishers', // The collection to join
                localField: 'publishers', // The field from the input documents
                foreignField: '_id', // The field from the documents of the "from" collection
                as: 'publishers' // The name of the new array field to add to the input documents
            }},
            { $project: { name: 1, thumbnail: 1, image: 1, year: 1, rating: 1, numRatings: 1, publishers: { name: 1 } } },
            { $limit: 50 }
        ]);

        // console.log(games.length);
        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}




// @desc    Get hot games
// @route   GET /api/games/for-you
// @access  Public
const getForYouGames = async (req, res) => {
    try {
        const myLibrary = await Library.find({ user: req.user._id })
        .sort({ rating: -1 })
        .limit(10)
        .select('game')
        .populate('game', 'categories');

        const games = await Game
        .find({
            _id: { $nin: myLibrary.map(item => item.game) },
            categories: {
                $in: myLibrary.map(item => item.game.categories)
            },
            numRatings: { $gt: 100 },
            rating: { $gt: 3 }
        })
        .sort({ rating: -1 })
        .populate('publishers', 'name')
        .limit(50)

        // console.log(games.length);
        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


module.exports = {
    getGamesByPublisherId,
    getGamesByPersonId,
    getGames,
    getSuggestions,
    createGame,
    getGameById,
    getGameOverview,
    getHotGames,
    getTrendingGames,
    getMostPlayedGames,
    getBestsellerGames,
    getForYouGames
}
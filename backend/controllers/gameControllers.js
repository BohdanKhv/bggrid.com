const Game = require('../models/gameModel');
const Play = require('../models/playModel');
const Library = require('../models/libraryModel');
const mongoose = require('mongoose');


// @desc    Get games by publisher id
// @route   GET /api/games/publisher/:publisherId
// @access  Public
const getGamesByPublisherId = async (req, res) => {
    try {
        const games = await Game.find({ publishers: mongoose.Types.ObjectId(req.params.publisherId) });

        res.status(200).json({
            data: games
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
        console.log(`Page: ${page}`);
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { rating: -1, year: -1 }
        };

        const { s, hideInLibrary } = req.query;

        const q = {}

        if (s && s.length > 0) { q.name = { $regex: s, $options: 'i' } }

        if (hideInLibrary) {
            const myLibrary = await Library.find({ user: req.user._id }).select('game');
            const gameIds = myLibrary.map(item => item.game._id);
            q._id = { $nin: gameIds };
        }
        const games = await Game.paginate(q, options);
        
        // Get current page and total pages
        const currentPage = games.page;
        const totalPages = games.totalPages;
        
        console.log(`Current Page: ${currentPage}`);
        console.log(`Total Pages: ${totalPages}`);

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
            name: { $regex: s || '', $options: 'i' }
        })
        .sort({ rating: -1, year: -1 })
        .limit(5)
        .select('name thumbnail year')

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
                    avgRating: { $avg: '$rating' },
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

        res.status(200).json({
            data: {
                ...game._doc,
                last3Plays,
                last3Reviews,
                playStats: playStats[0],
                reviewStats: reviewStats[0]
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getGamesByPublisherId,
    getGames,
    getSuggestions,
    createGame,
    getGameById,
    getGameOverview
}
const Library = require('../models/libraryModel');
const Game = require('../models/gameModel');
const Play = require('../models/playModel');
const Notification = require('../models/notificationModel');
const Follow = require('../models/followModel');
const mongoose = require('mongoose');


// @desc    Get reviews by game
// @route   GET /api/library/reviews/:gameId
// @access  Public
const getReviewsByGame = async (req, res) => {
    try {
        const { limit, page } = req.query;

        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 },
            populate: {
                path: 'user',
                select: 'avatar username firstName lastName'
            }
        };

        const reviews = await Library.paginate(
            { game: req.params.gameId },
            options
        )

        const currentPage = reviews.page;
        const totalPages = reviews.totalPages;

        res.status(200).json({
            data: reviews.docs,
            currentPage,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get my library
// @route   GET /api/library/my-library
// @access  Public
const getMyLibrary = async (req, res) => {
    try {
        const games = await Library.find({ user: req.user._id })
        .populate('game');

        const sortedGames = games.sort((a, b) => {
            return a.game.name.localeCompare(b.game.name);
        });
    
        res.status(200).json({
            data: sortedGames,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Add a game to my library
// @route   POST /api/library/
// @access  Private
const addGameToLibrary = async (req, res) => {
    try {
        const { gameId, tags, comment, rating } = req.body;

        if (!gameId) {
            return res.status(400).json({ msg: 'Please provide a game id' });
        }

        // check if the game exists
        const gameExists = await Game.findById(gameId);

        if (!gameExists) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        // Check if the game is already in the library
        const gameInLibrary = await Library.findOne({
            user: req.user._id,
            game: gameId,
        });

        if (gameInLibrary) {
            return res.status(400).json({ msg: 'Game already in library' });
        }

        if (rating && (rating < 0 || rating > 5)) {
            return res.status(400).json({ msg: 'Rating must be between 0 and 5' });
        }

        // calculate my total plays for this game, total play time, total wins
        let playData = await Play.aggregate([
            { $match: { game: new mongoose.Types.ObjectId(gameId), user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: 1 },
                    totalPlayTime: { $sum: '$playTimeMinutes' },
                    totalWins: { $sum: { $cond: { if: { $arrayElemAt: ['$players.winner', 0] }, then: 1, else: 0 } } },
                    lastPlayDate: { $max: '$playDate' }
                }
            }
        ]);
        
        playData = playData[0];

        const newGame = new Library({
            user: req.user._id,
            game: gameExists,
            tags,
            comment,
            rating,
            totalPlays: playData ? playData.totalPlays || 0 : 0,
            totalPlayTime: playData ? playData.totalPlayTime || 0 : 0,
            totalWins: playData ? playData.totalWins || 0 : 0,
            lastPlayDate: playData ? playData.lastPlayDate || null : null,
        });

        await newGame.save();

        // Create a notification for follow
        const followers = await Follow.find({
            following: req.user._id,
        });

        if (followers.length) {
            const notifications = [];
            followers.forEach(u => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: u.follower,
                    type: 'library',
                    message: `added "${gameExists.name}" to their library and rated it ${rating}/5`,
                }));
            });

            Notification.insertMany(notifications);
        }

        res.status(201).json({
            data: newGame,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Update a game in my library
// @route   PUT /api/library/:gameId
// @access  Private
const updateGameInLibrary = async (req, res) => {
    try {
        const { tags, comment, rating } = req.body;

        const game = await Library.findOne({
            game: req.params.gameId,
            user: req.user._id,
        })
        .populate('game');

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        if (game.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (rating && (rating < 0 || rating > 10)) {
            return res.status(400).json({ msg: 'Rating must be between 0 and 10' });
        }

        game.tags = tags;
        game.comment = comment;
        game.rating = rating;

        await game.save();

        // Create a notification for follow
        const follow = await Friend.find({
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ],
            pending: false
        });

        if (follow.length) {
            const notifications = [];
            follow.forEach(friend => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: friend.user1.toString() === req.user._id.toString() ? friend.user2 : friend.user1,
                    type: 'library',
                    message: `updated "${game.game.name}" in their library and rated it ${rating}/10`,
                }));
            });

            Notification.insertMany(notifications);
        }

        res.status(200).json({
            data: game,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// Remove a game from my library
// @route   DELETE /api/library/:gameId
// @access  Private
const removeGameFromLibrary = async (req, res) => {
    try {
        const game = await Library.findOne({
            user: req.user._id,
            game: req.params.gameId,
        })
        .populate('game');

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        if (game.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await game.deleteOne();

        // Create a notification for follow
        const follow = await Friend.find({
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ],
            pending: false
        });

        if (follow.length) {
            const notifications = [];
            follow.forEach(friend => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: friend.user1.toString() === req.user._id.toString() ? friend.user2 : friend.user1,
                    type: 'library',
                    message: `removed "${game.game.name}" from their library`,
                }));
            });

            Notification.insertMany(notifications);
        }

        res.status(200).json({
            msg: 'Game removed',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get game stats
// @route   GET /api/library/stats/:gameId
// @access  Public
const getGameStats = async (req, res) => {
    try {
        // Get stats
        // total rating, avg rating, (from tags: total favorites, total owned, total played, total wishlisted, total want to play)

        const stats = await Library.aggregate([
            { $match: { game: new mongoose.Types.ObjectId(req.params.gameId) } },
            { $project: { rating: 1, tags: 1 } }, // Project fields to verify the match stage
            {
                $group: {
                    _id: null,
                    totalRating: { $sum: '$rating' },
                    avgRating: { $avg: '$rating' },
                    totalFavorites: { $sum: { $cond: { if: { $in: ['Favorite', '$tags'] }, then: 1, else: 0 } } },
                    totalOwned: { $sum: { $cond: { if: { $in: ['Owned', '$tags'] }, then: 1, else: 0 } } },
                    totalPlayed: { $sum: { $cond: { if: { $in: ['Played', '$tags'] }, then: 1, else: 0 } } },
                    totalWishlist: { $sum: { $cond: { if: { $in: ['Wishlist', '$tags'] }, then: 1, else: 0 } } },
                    totalWantToPlay: { $sum: { $cond: { if: { $in: ['Want to Play', '$tags'] }, then: 1, else: 0 } } },
                }
            }
        ]);

        console.log(stats);

        res.status(200).json({
            data: stats[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getMyLibrary,
    getReviewsByGame,
    addGameToLibrary,
    updateGameInLibrary,
    removeGameFromLibrary,
    getGameStats
}
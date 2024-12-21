const Library = require('../models/libraryModel');
const Game = require('../models/gameModel');
const Play = require('../models/playModel');
const Notification = require('../models/notificationModel');
const Follow = require('../models/followModel');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');


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
                    totalWins: { $sum: { $cond: { if: { $and: [ { $eq: [ '$players', req.user._id ] }, { $arrayElemAt: ['$players.winner', 0] } ] }, then: 1, else: 0 } } },
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
        }).populate('follower', 'notifications')
        .select('follower');

        const notifyFollowers = followers.filter(f => f.follower.notifications?.followingUsersLibraryUpdates);

        if (notifyFollowers.length) {
            const notifications = [];
            notifyFollowers.forEach(u => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: u.follower._id,
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

        // Create a notification for followers

        const followers = await Follow.find({
            following: req.user._id,
        }).populate('follower', 'notifications')
        .select('follower');

        const notifyFollowers = followers.filter(f => f?.follower?.notifications?.followingUsersLibraryUpdates);

        if (notifyFollowers.length) {
            const notifications = [];
            notifyFollowers.forEach(u => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: u.follower._id,
                    type: 'library',
                    message: `updated "${game.game.name}" in their library and rated it ${rating}/5`,
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


// Import collection data from BGG
// @route   POST /api/library/import-bgg-collection
// @access  Private
const importBggCollection = async (req, res) => {
    try {
        const bggUsername = req.user.bggUsername;

        if (!bggUsername) {
            return res.status(400).json({ msg: 'Please provide a BGG username' });
        }

        const response = await axios.get(`https://boardgamegeek.com/xmlapi2/collection?username=${bggUsername}&stats=1`);

        if (!response.data || !response.data.length) {
            return res.status(404).json({ msg: 'No collection found' });
        }

        const $ = cheerio.load(response.data);

        const bulkWriteOps = [];
        const games = [];
        const gameIds = [];

        if ($('error').length) {
            return res.status(404).json({ msg: 'Invalid BGG username' });
        }

        if ($('message').length) {
            return res.status(404).json({ msg: 'BGG is currently over capacity, please try again' });
        }

        $('item').each((i, el) => {
            const bggId = $(el).attr('objectid');
            const rating = $(el).find('stats').find('rating').attr('value');
            const tags = [];
            if ($(el).find('status').attr('own') === '1') tags.push('Own');
            if ($(el).find('status').attr('prevowned') === '1') tags.push('Prev Owned');
            if ($(el).find('status').attr('wishlist') === '1') tags.push('Wishlist');
            if ($(el).find('status').attr('played') === '1') tags.push('Played');
            if ($(el).find('status').attr('wanttoplay') === '1') tags.push('Want to Play');
            if ($(el).find('status').attr('want') === '1') tags.push('Want in Trade');
            if ($(el).find('status').attr('preordered') === '1') tags.push('Preordered');

            gameIds.push(bggId);
            games.push({
                bggId: bggId.toString(),
                rating: rating && rating > 0 ? rating / 2 : 0, // BGG rating is out of 10 but we use 5
                tags,
            });
        });

        if (!games.length) {
            return res.status(404).json({ msg: 'No games found in collection' });
        }


        // get all games from the database
        const allGames = await Game.find({bggId: { $in: gameIds }});

        if (allGames.length == 0 ) {
            return res.status(404).json({ msg: 'No games found in our database' });
        }

        // get all games from the library
        allGames.forEach(game => {
            const gameInLibrary = games.find(g => g.bggId === game.bggId);
            if (gameInLibrary) {
                bulkWriteOps.push({
                    updateOne: {
                        filter: {
                            game: game._id,
                            user: req.user._id,
                        },
                        update: { $set: { tags: gameInLibrary.tags, rating: gameInLibrary.rating } },
                        upsert: true,
                    },
                });
            }
        });

        await Library.bulkWrite(bulkWriteOps);

        // Get the updated library
        const updatedLibrary = await Library.find({ user: req.user._id })
        .populate('game');

        return res.status(200).json({
            data: updatedLibrary,
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
    getGameStats,
    importBggCollection
}
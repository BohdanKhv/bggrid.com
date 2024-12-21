const { DateTime } = require('luxon');
const User = require('../models/userModel');
const Game = require('../models/gameModel');
const Play = require('../models/playModel');
const Library = require('../models/libraryModel');
const Notification = require('../models/notificationModel');
const mongoose = require('mongoose');


// @desc    Get play by ID
// @route   GET /api/plays/:playId
// @access  Private
const getPlayById = async (req, res) => {
    try {
        const play = await Play.findById(req.params.playId)
            .populate([{
                path: 'game players.user user',
                select: 'avatar username firstName lastName name thumbnail'
            }]);

        if (!play) {
            return res.status(404).json({ msg: '404' });
        }

        res.status(200).json({
            data: play
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Update play
// @route   PUT /api/plays/:playId
// @access  Private
const updatePlay = async (req, res) => {
    try {
        const { comment, playTimeMinutes, players } = req.body;

        const play = await Play.findOne({
            _id: req.params.playId,
            $or: [
                { user: req.user._id },
                { 'players.user': req.user._id }
            ]
        });

        if (!play) {
            return res.status(404).json({ msg: 'Play not found' });
        }

        play.comment = comment;
        play.playTimeMinutes = playTimeMinutes;
        play.players = players;

        await play.save();

        // Update library
        const library = await Library.findOne({ user: req.user._id, game: play.game });

        if (library) {
            library.totalPlayTime += playTimeMinutes;
            library.totalPlays += 1;
            // Check if user is a winner
            const winner = players.find(player => player.winner);
            if (winner) {
                library.totalWins += 1;
            }
            library.save();
        }

        // Populate game and user
        await play.populate([{
            path: 'game players.user user',
            select: 'avatar username firstName lastName name thumbnail'
        }])

        res.status(200).json({
            data: play
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



// @desc    Get my plays
// @route   GET /api/plays/my-plays
// @access  Private
const getMyPlays = async (req, res) => {
    try {
        const { page, limit, selectedGame, tags } = req.query;

        let q = {}

        if (selectedGame) {
            q.game = selectedGame;
        }
        if (tags) {
            if (tags.toLowerCase() === 'wins') {
                q.players = {
                    $elemMatch: {
                        user: req.user._id,
                        winner: true
                    }
                }
            } else if (tags.toLowerCase() === 'losses') {
                q.players = {
                    $elemMatch: {
                        user: req.user._id,
                        winner: false
                    }
                }
            }
        }
        q.user = req.user._id

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 40,
            sort: { playDate: -1 },
            populate: {
                path: 'game players.user user',
                select: 'avatar username firstName lastName name thumbnail'
            }
        };

        const plays = await Play.paginate(q, options)

        const currentPage = plays.page;
        const totalPages = plays.totalPages;

        return res.status(200).json({
            data: plays.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get plays by game
// @route   GET /api/plays/game/:username
// @access  Public
const getPlaysByUsername = async (req, res) => {
    try {
        const { page, limit } = req.query;

        // Get user
        const user = await User.findOne({ username: { $regex: req.params.username, $options: 'i' } });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 40,
            sort: { playDate: -1 },
            populate: {
                path: 'user players.user game',
                select: 'avatar username firstName lastName name thumbnail'
            }
        };

        const plays = await Play.paginate({
            // $or: [
                // { 'players.user': user._id },
                // { user: user._id }
            // ]
            user: user._id
        }, options);

        const currentPage = plays.page;
        const totalPages = plays.totalPages;

        return res.status(200).json({
            data: plays.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get plays by game
// @route   GET /api/plays/game/:gameId
// @access  Public
const getPlaysByGame = async (req, res) => {
    try {
        const { page, limit } = req.query;

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 40,
            sort: { playDate: -1 },
            populate: {
                path: 'user players.user',
                select: 'avatar username firstName lastName'
            }
        };

        const plays = await Play.paginate({ game: req.params.gameId }, options);

        const currentPage = plays.page;
        const totalPages = plays.totalPages;

        return res.status(200).json({
            data: plays.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Create play
// @route   POST /api/plays
// @access  Private
const createPlay = async (req, res) => {
    try {
        const { gameId, comment, playTimeMinutes, players, playDate } = req.body;

        if (!gameId) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        // Check if game exists
        const gameExists = await Game.findById(gameId);

        if (!gameExists) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        const play = await Play.create({
            game: gameId,
            comment,
            playTimeMinutes,
            players,
            playDate,
            user: req.user._id
        });

        // Update library
        const library = await Library.findOne({ user: req.user._id, game: gameId }).populate('game');
        let libraryItem = null;

        if (library) {
            library.totalPlays += 1;
            library.totalPlayTime += playTimeMinutes || 0;
            // Check if user is a winner
            const winner = players.find(player => player.winner);
            if (winner) {
                library.totalWins += 1;
            }
            library.lastPlayDate = DateTime.now();
            await library.save();
            libraryItem = library;
        } else {
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

            const winner = players.find(player => player.winner);

            libraryItem = new Library({
                user: req.user._id,
                game: gameExists,
                tags: ["Played"],
                rating: 0,
                totalPlays: playData ? (playData.totalPlays + 1) : 1,
                totalPlayTime: playData ? (playData.totalPlayTime + (playTimeMinutes || 0)) : (playTimeMinutes || 0),
                totalWins: playData ? (playData.totalWins + (winner ? 1 : 0)) : winner ? 1 : 0,
                lastPlayDate: playData ? playData.lastPlayDate || new Date() : new Date()
            });

            await libraryItem.save(); // don't need to wait for this to finish
        }

        // Populate game and user
        await play.populate([
            { path: 'game', select: 'name thumbnail' },
            { path: 'players.user', select: 'avatar username firstName lastName notifications' },
            { path: 'user', select: 'avatar username firstName lastName' }
        ]);

        const uIds = play?.players?.filter(u => u?.user && u?.user?._id.toString() !== req.user._id.toString() && u?.user?.notifications?.taggedInPlays).map(u => u.user._id);

        if (uIds.length) {
            const notifications = [];
            uIds.forEach(uId => {
                notifications.push(new Notification({
                    sender: req.user._id,
                    receiver: uId,
                    type: 'play',
                    link: `/u/${req.user.username}/plays/${play._id}`,
                    message: `played "${gameExists.name}" with you`,
                }));
            });

            Notification.insertMany(notifications);
        }

        res.status(201).json({
            data: {
                play,
                library: libraryItem
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Delete play
// @route   DELETE /api/plays/:playId
// @access  Private
const deletePlay = async (req, res) => {
    try {
        const play = await Play.findById(req.params.playId);

        if (!play) {
            return res.status(404).json({ msg: 'Play not found' });
        }

        if (play.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await play.deleteOne();

        // Update library
        const library = await Library.findOne({ user: req.user._id, game: play.game });

        if (library) {
            library.totalPlays -= 1;
            library.totalPlayTime -= play.playTimeMinutes;
            // Check if user is a winner
            const winner = play.players.find(player => player.winner);
            if (winner) {
                library.totalWins -= 1;
            }
            library.save();
        }

        return res.status(200).json({ msg: 'Play removed' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get my plays
// @route   GET /api/plays/my-plays
// @access  Private
const getGameStats = async (req, res) => {
    try {
        // Get stats
        // average playtime, average players, total plays, avg win rate, avg score

        const stats = await Play.aggregate([
            { $match: { game: new mongoose.Types.ObjectId(req.params.gameId) } },
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: 1 },
                    avgPlayTime: { $avg: '$playTimeMinutes' },
                    avgPlayers: { $avg: { $size: '$players' } },
                    avgWinRate: { $avg: { $cond: { if: { $arrayElemAt: ['$players.winner', 0] }, then: 1, else: 0 } } },
                    // Players.score
                    avgScore: { $avg: { $avg: '$players.score' } }
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
    getMyPlays,
    getPlayById,
    updatePlay,
    getPlaysByGame,
    getPlaysByUsername,
    createPlay,
    deletePlay,
    getGameStats
};
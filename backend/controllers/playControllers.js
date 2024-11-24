const { DateTime } = require('luxon');
const Game = require('../models/gameModel');
const Play = require('../models/playModel');
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
        } else {
            q.$or = [
                { 'players.user': req.user._id },
                { user: req.user._id }
            ]
        }

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

        // Populate game and user
        await play.populate([
            { path: 'game', select: 'name thumbnail' },
            { path: 'players.user', select: 'avatar username firstName lastName' },
            { path: 'user', select: 'avatar username firstName lastName' }
        ]);

        res.status(201).json({
            data: play
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

        res.status(200).json({ msg: 'Play removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
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
                    avgScore: { $avg: '$score' }
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
    createPlay,
    deletePlay,
    getGameStats
};
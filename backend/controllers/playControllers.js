const Game = require('../models/gameModel');
const Play = require('../models/playModel');


// @desc    Get my plays
// @route   GET /api/plays/my-plays
// @access  Private
const getMyPlays = async (req, res) => {
    try {
        const { page, limit } = req.query;

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 40,
            sort: { playDate: -1 }
        };

        const plays = await Play.paginate({ user: req.user._id }, options);

        return res.status(200).json({
            data: plays
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
            sort: { playDate: -1 }
        };

        const plays = await Play.paginate({ game: req.params.gameId }, options);

        return res.status(200).json({
            data: plays
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
        const { game, pros, cons, playTimeMinutes, players, playDate } = req.body;

        if (!game || !playDate) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        // Check if game exists
        const gameExists = await Game.findById(game);

        if (!gameExists) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        const play = await Play.create({
            game,
            pros,
            cons,
            playTimeMinutes,
            players,
            playDate,
            user: req.user._id
        });

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


module.exports = {
    getMyPlays,
    getPlaysByGame,
    createPlay,
    deletePlay,
};
const Library = require('../models/libraryModel');
const Game = require('../models/gameModel');


// @desc    Get my library
// @route   GET /api/library/my-library
// @access  Public
const getMyLibrary = async (req, res) => {
    try {
        const games = await Library.find({ user: req.user._id })
        .populate('game');
    
        res.status(200).json({
            data: games,
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

        if (rating && (rating < 0 || rating > 10)) {
            return res.status(400).json({ msg: 'Rating must be between 0 and 10' });
        }

        const newGame = new Library({
            user: req.user._id,
            game: gameExists,
            tags,
            comment,
            rating,
        });

        await newGame.save();

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
        });

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        if (game.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await game.remove();

        res.status(200).json({
            msg: 'Game removed',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getMyLibrary,
    addGameToLibrary,
    updateGameInLibrary,
    removeGameFromLibrary
}
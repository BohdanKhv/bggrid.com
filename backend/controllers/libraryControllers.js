const Library = require('../models/libraryModel');
const Game = require('../models/gameModel');


// @desc    Get my library
// @route   GET /api/library/my-library
// @access  Public
const getMyLibrary = async (req, res) => {
    try {
        const games = await Library.find({ user: req.user._id });
    
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
        const { game, tags, comment, rating } = req.body;

        if (!game) {
            return res.status(400).json({ msg: 'Please provide a game id' });
        }

        // check if the game exists
        const gameExists = await Game.findById(game);

        if (!gameExists) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        const newGame = new Library({
            user: req.user._id,
            game,
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


// Remove a game from my library
// @route   DELETE /api/library/:id
// @access  Private
const removeGameFromLibrary = async (req, res) => {
    try {
        const game = await Library.findOne({
            user: req.user._id,
            _id: req.params.id,
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
    removeGameFromLibrary
}
const Game = require('../models/gameModel');
const Publisher = require('../models/publisherModel');
const mongoose = require('mongoose');


// @desc    Get publisher by id
// @route   GET /api/publisher/:publisherId
// @access  Public
const getPublisherById = async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.publisherId);

        if (!publisher) {
            return res.status(404).json({ msg: '404' });
        }

        const games = await Game.find({ publishers: publisher._id });

        res.status(200).json({
            data: {
                ...publisher._doc,
                games: games
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get all publishers
// @route   GET /api/publishers
// @access  Public
const getPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find();

        res.status(200).json({
            data: publishers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getPublishers,
    getPublisherById,
}
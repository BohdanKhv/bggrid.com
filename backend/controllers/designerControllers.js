const Game = require('../models/gameModel');
const Designer = require('../models/designerModel');
const mongoose = require('mongoose');


// @desc    Get designer by id
// @route   GET /api/designer/:designerId
// @access  Public
const getDesignerById = async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.designerId);

        if (!designer) {
            return res.status(404).json({ msg: '404' });
        }

        const games = await Game.find({ designers: designer._id });

        res.status(200).json({
            data: {
                ...designer._doc,
                games: games
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get all designers
// @route   GET /api/designers
// @access  Public
const getDesigners = async (req, res) => {
    try {
        const designers = await Designer.find();

        res.status(200).json({
            data: designers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getDesigners,
    getDesignerById,
}
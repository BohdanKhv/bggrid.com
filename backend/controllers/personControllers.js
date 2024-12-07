const Game = require('../models/gameModel');
const Person = require('../models/personModel');
const mongoose = require('mongoose');


// @desc    Get person by id
// @route   GET /api/person/:personId
// @access  Public
const getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.personId);

        if (!person) {
            return res.status(404).json({ msg: '404' });
        }

        const games = await Game.find({ persons: person._id });

        res.status(200).json({
            data: {
                ...person._doc,
                games: games
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get all persons
// @route   GET /api/persons
// @access  Public
const getPersons = async (req, res) => {
    try {
        const persons = await Person.find();

        res.status(200).json({
            data: persons
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}



module.exports = {
    getPersons,
    getPersonById,
}
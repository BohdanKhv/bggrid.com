const Game = require('../models/gameModel');


// @desc    Get games
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 40,
            sort: { createdAt: -1 }
        };

        const { s } = req.query;

        const games = await Game.paginate({
            name: { $regex: s || '', $options: 'i' }
        }, options);
        
        // Get current page and total pages
        const currentPage = games.page;
        const totalPages = games.totalPages;
        
        console.log(`Current Page: ${currentPage}`);
        console.log(`Total Pages: ${totalPages}`);

        res.status(200).json({
            data: games.docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get games
// @route   GET /api/games/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
    try {
        const { s } = req.query;

        const games = await Game.find({
            name: { $regex: s || '', $options: 'i' }
        }).limit(5)
        .select('name thumbnail yearPublished')
        .sort({ createdAt: -1 });

        res.status(200).json({
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

// @desc    Create a new game
// @route   POST /api/games
// @access  Private
const createGame = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        const game = await Game.create({
            title,
            description,
            verified: false
        });

        res.status(201).json({
            data: game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}


// @desc    Get a game by id
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ msg: '404' });
        }

        res.status(200).json({
            data: game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}




module.exports = {
    getGames,
    getSuggestions,
    createGame,
    getGameById
}
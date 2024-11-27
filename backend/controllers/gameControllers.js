const Game = require('../models/gameModel');
const Library = require('../models/libraryModel');


// @desc    Get games
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
    try {
        const { page, limit } = req.query;
        console.log(`Page: ${page}`);
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const { s, hideInLibrary } = req.query;

        const q = {}

        if (s && s.length > 0) { q.name = { $regex: s, $options: 'i' } }

        if (hideInLibrary) {
            const myLibrary = await Library.find({ user: req.user._id }).select('game');
            const gameIds = myLibrary.map(item => item.game._id);
            q._id = { $nin: gameIds };
        }
        const games = await Game.paginate(q, options);
        
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
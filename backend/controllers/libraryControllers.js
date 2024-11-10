const Library = require('../models/libraryModel');


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



module.exports = {
    getMyLibrary,
}
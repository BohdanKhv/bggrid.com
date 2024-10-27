const User = require('../models/userModel');




// @desc    Get me
// @route   GET /api/users/me
// @access  Private
const getGiftIdeas = async (req, res) => {
    try {
        return res.status(200).json({
            data: {
                ...req.user,
                token: generateToken(req.user._id)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
}



module.exports = {
    getGiftIdeas,
}
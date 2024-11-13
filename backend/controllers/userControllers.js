const User = require('../models/userModel');



// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await
        User.findOne({ username: req.params.username })
            .select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        data: user
    });
}
);
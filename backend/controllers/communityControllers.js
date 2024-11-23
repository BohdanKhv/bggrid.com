const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Play = require('../models/playModel');
const Friend = require('../models/friendModel');


// @desc    Get community feed
// @route   GET /api/feed/community
// @access  Private
const getCommunityFeed = async (req, res) => {
    // !TODO - Implement getCommunityFeed (friends recent plays and library updates)
}


// @desc    Get home feed
// @route   GET /api/feed/home
// @access  Private
const getHomeFeed = async (req, res) => {
    // !TODO - Implement getHomeFeed (recommended games, friend recent plays, etc.)
}


module.exports = {
    getCommunityFeed,
    getHomeFeed
}
const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Library = require('../models/libraryModel');
const Play = require('../models/playModel');
const Follow = require('../models/followModel');


// @desc    Get community feed
// @route   GET /api/feed/community-for-you
// @access  Private
const getCommunityFeedForYou = async (req, res) => {
    let { page, limit, type } = req.query;
    type = type ? type.toLowerCase() : 'all';
    page = parseInt(page) || 1;
    limit = (parseInt(limit) || 20) / (type === 'all' ? 2 : 1);

    try {
        // Get all games from user's library, only ids of the games
        let userLibrary = await Library.find({ user: req.user._id }).select('game');
        userLibrary = userLibrary.map(libraryItem => libraryItem.game);

        if (userLibrary.length === 0) {
            return res.status(200).json({
                data: [],
                hasMore: false
            });
        }

        let recentPlays = [];
        let libraryItems = [];

        if (type === 'all' || type === 'plays') {
            recentPlays = await Play.paginate(
                { game: { $in: userLibrary }, user: { $ne: req.user._id } },
                {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: [
                        { path: 'game', select: 'name thumbnail' },
                        { path: 'players.user', select: 'avatar username firstName lastName' },
                        { path: 'user', select: 'avatar username firstName lastName' },
                        { path: 'image', select: 'image' }
                    ]
                }
            );
        }

        if (type === 'all' || type === 'library') {
            libraryItems = await Library.paginate(
                { game: { $in: userLibrary }, user: { $ne: req.user._id } },
                {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: [
                        { path: 'game', select: 'name thumbnail' },
                        { path: 'user', select: 'avatar username firstName lastName' }
                    ]
                }
            );
        }

        // Combine plays and library items
        const feedItems = [];

        if (type === 'all' || type === 'plays') {
            feedItems.push(...recentPlays.docs.map(play => ({
                type: 'play',
                item: play
            })));
        }

        if (type === 'all' || type === 'library') {
            feedItems.push(...libraryItems.docs.map(libraryItem => ({
                type: 'library',
                item: libraryItem
            })));
        }

        // Sort feed items by updatedAt
        feedItems.sort((a, b) => (b.item.createdAt ) - (a.item.createdAt ));

        // Determine if there are more items to fetch
        const hasMore = (recentPlays.hasNextPage || libraryItems.hasNextPage);

        return res.status(200).json({
            data: feedItems,
            hasMore
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// @desc    Get community feed
// @route   GET /api/feed/community
// @access  Private
const getCommunityFeed = async (req, res) => {
    let { page, limit, type } = req.query;
    type = type ? type.toLowerCase() : 'all';
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    try {
        let following = await Follow.find({ follower: req.user._id })
        following = following.map(follow => follow.following);

        if (following.length === 0) {
            return res.status(200).json({
                data: [],
                hasMore: false
            });
        }

        let followingRecentPlays = [];
        let followingLibraryItems = [];

        if (type === 'all' || type === 'plays') {
            followingRecentPlays = await Play.paginate(
                { user: { $in: following } },
                {
                    page,
                    limit,
                    sort: { updatedAt: -1 },
                    populate: [
                        { path: 'game', select: 'name thumbnail' },
                        { path: 'players.user', select: 'avatar username firstName lastName' },
                        { path: 'user', select: 'avatar username firstName lastName' },
                        { path: 'image', select: 'image' }
                    ]
                }
            );
        }

        if (type === 'all' || type === 'library') {
            followingLibraryItems = await Library.paginate(
                { user: { $in: following } },
                {
                    page,
                    limit,
                    sort: { updatedAt: -1 },
                    populate: [
                        { path: 'game', select: 'name thumbnail' },
                        { path: 'user', select: 'avatar username firstName lastName' }
                    ]
                }
            );
        }

        // Combine plays and library items
        const feedItems = [];

        if (type === 'all' || type === 'plays') {
            feedItems.push(...followingRecentPlays.docs.map(play => ({
                type: 'play',
                item: play
            })));
        }

        if (type === 'all' || type === 'library') {
            feedItems.push(...followingLibraryItems.docs.map(libraryItem => ({
                type: 'library',
                item: libraryItem
            })));
        }

        // Sort feed items by updatedAt
        feedItems.sort((a, b) => (b.item.updatedAt || b.item.createdAt ) - (a.item.updatedAt || a.item.createdAt ));

        // Determine if there are more items to fetch
        const hasMore = (followingRecentPlays.hasNextPage || followingLibraryItems.hasNextPage);

        return res.status(200).json({
            data: feedItems,
            hasMore
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// @desc   Get home feed
// @route  GET /api/feed/home
// @access Private
const getHomeFeed = async (req, res) => {
    try {
        const recentlyPlayed = await Play
        .find({ user: req.user._id })
        .sort({ updatedAt: -1 })
        .limit(15)
        .populate('game', 'name thumbnail image');

        // My stats in the last 30 days
        const playStats = await Play.aggregate([
            { $match: {
                user: req.user._id,
                updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            } },
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: 1 },
                    totalPlayTime: { $sum: '$playTimeMinutes' },
                    avgPlayTime: { $avg: '$playTimeMinutes' },
                    avgPlayers: { $avg: { $size: '$players' } },
                    uniqueGamesPlayed: { $addToSet: '$game' },
                    uniquePlayersPlayed: { $addToSet: '$players.user' },
                    totalWins: { 
                        $sum: { 
                            $size: { 
                                $filter: { 
                                    input: '$players', 
                                    as: 'player', 
                                    cond: { 
                                        $and: [
                                            { $eq: ['$$player.user', req.user._id] },
                                            { $eq: ['$$player.winner', true] }
                                        ] 
                                    } 
                                } 
                            } 
                        } 
                    },                    // if current user is player and winner, then count as win
                    // avgWinRate: { $avg: { $cond: { if: { $and: [ { $eq: [ '$players', req.user._id ] }, { $arrayElemAt: ['$players.winner', 0] } ] }, then: 1, else: 0 } } },
                    avgScore: { $avg: { $avg: '$players.score' } }
                }
            }
        ]);

        const mostPopular = await Game.find(
            // [
                // { $match: {
                {
                    year: { $gte: 2000 },
                }
                // }},
                // { $sample: { size: 15 } },
            // ]
        )
        .sort({ numRatings: -1 })
        .limit(10)
        .select('name thumbnail image');

        // const newGames = await Game
        // .find()
        // .sort({ year: -1 })
        // .limit(15)
        // most played
        // const mostPlayed = await Library.aggregate([
        //     { $match: { user: req.user._id } },
        //     { $group: { _id: '$game', count: { $sum: 1 }, lastPlayDate: { $max: '$lastPlayDate' }, totalPlays: { $sum: '$totalPlays' } } },
        //     { $sort: { count: -1 } },
        //     { $limit: 15 },
        //     { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
        //     { $unwind: '$game' }
        // ]);

        let recommended = []

        if (recentlyPlayed.length > 0) {
            recommended = await Game.aggregate(
                [
                    { $match: {
                        year: { $gte: 2000 },
                        rating: { $gte: 3 },
                        numRatings: { $gte: 500 },
                        $or: [
                            { categories: { $in: recentlyPlayed.map(game => game.categories) } },
                            { themes: { $in: recentlyPlayed.map(game => game.themes) } },
                            { types: { $in: recentlyPlayed.map(game => game.types) } }
                        ]
                    }},
                    { $sample: { size: 15 } }
                ]
            )
        } else {
            recommended = await Game.aggregate(
                [
                    { $match: {
                        complexityWeightedRating: { $gte: 0 },
                        year: { $gte: 2000 },
                        rating: { $gte: 50 }
                    }},
                    { $sample: { size: 15 } }
                ]
            )
        }

        return res.status(200).json({
            data: {
                recentlyPlayed,
                // mostPlayed,
                playStats: playStats[0],
                mostPopular,
                recommended
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// @desc   Get home feed
// @route  GET /api/feed/general-home
// @access Public
const getGeneralHomeFeed = async (req, res) => {
    try {
        // just a few random games for now
        const recommended = await Game.aggregate(
            [
                { $match: {
                    complexityWeightedRating: { $gte: 0 },
                    year: { $gte: 2000 },
                    rating: { $gte: 50 }
                }},
                { $sample: { size: 15 } }
            ]
        )

        // most played
        const mostPlayed = await Library.aggregate([
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        // const mostFavorite = await Library.aggregate([
        //     { $match: { tags: 'Favorite' } },
        //     { $group: { _id: '$game', count: { $sum: 1 } } },
        //     { $sort: { count: -1 } },
        //     { $limit: 10 },
        //     { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
        //     { $unwind: '$game' }
        // ]);

        // const mostOwned = await Library.aggregate([
        //     { $match: { tags: 'Owned' } },
        //     { $group: { _id: '$game', count: { $sum: 1 } } },
        //     { $sort: { count: -1 } },
        //     { $limit: 10 },
        //     { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
        //     { $unwind: '$game' }
        // ]);

        // const mostWanted = await Library.aggregate([
        //     { $match: { tags: 'Wishlist' } },
        //     { $group: { _id: '$game', count: { $sum: 1 } } },
        //     { $sort: { count: -1 } },
        //     { $limit: 10 },
        //     { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
        //     { $unwind: '$game' }
        // ]);

        return res.status(200).json({
            data: {
                recommended,
                mostPlayed,
                // mostFavorite,
                // mostOwned,
                // mostWanted
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// @desc   Get home feed
// @route  GET /api/feed/collection/most-wanted
// @access Public
const getMostWanted = async (req, res) => {
    try {
        const mostWanted = await Library.aggregate([
            { $match: { tags: 'Wishlist' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        return res.status(200).json({
            data: mostWanted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// @desc   Get home feed
// @route  GET /api/feed/collection/most-owned
// @access Public
const getMostOwned = async (req, res) => {
    try {
        const mostOwned = await Library.aggregate([
            { $match: { tags: 'Owned' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        return res.status(200).json({
            data: mostOwned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// @desc   Get home feed
// @route  GET /api/feed/collection/most-favorite
// @access Public
const getMostFavorite = async (req, res) => {
    try {
        const mostFavorite = await Library.aggregate([
            { $match: { tags: 'Favorite' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        return res.status(200).json({
            data: mostFavorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getCommunityFeedForYou,
    getCommunityFeed,
    getGeneralHomeFeed,
    getHomeFeed,
    getMostFavorite,
    getMostOwned,
    getMostWanted
}
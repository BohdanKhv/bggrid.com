const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Library = require('../models/libraryModel');
const Play = require('../models/playModel');
const Friend = require('../models/friendModel');


// @desc    Get community feed
// @route   GET /api/feed/community
// @access  Private
const getCommunityFeed = async (req, res) => {
    let { page, limit, type } = req.query;
    type = type ? type.toLowerCase() : 'all';
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    try {
        let myFriends = await Friend.find({
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ],
            pending: false
        });
        myFriends = myFriends.map(friend => friend.user1.equals(req.user._id) ? friend.user2 : friend.user1);

        if (myFriends.length === 0) {
            return res.status(200).json({
                data: [],
                hasMore: false
            });
        }

        let friendsRecentPlays = [];
        let friendsLibraryItems = [];

        if (type === 'all' || type === 'plays') {
            friendsRecentPlays = await Play.paginate(
                { user: { $in: myFriends } },
                {
                    page,
                    limit,
                    sort: { updatedAt: -1 },
                    populate: [
                        { path: 'game', select: 'name thumbnail' },
                        { path: 'players.user', select: 'avatar username firstName lastName' },
                        { path: 'user', select: 'avatar username firstName lastName' }
                    ]
                }
            );
        }

        if (type === 'all' || type === 'library') {
            friendsLibraryItems = await Library.paginate(
                { user: { $in: myFriends } },
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
            feedItems.push(...friendsRecentPlays.docs.map(play => ({
                type: 'play',
                item: play
            })));
        }

        if (type === 'all' || type === 'library') {
            feedItems.push(...friendsLibraryItems.docs.map(libraryItem => ({
                type: 'library',
                item: libraryItem
            })));
        }

        // Sort feed items by updatedAt
        feedItems.sort((a, b) => (b.item.updatedAt || b.item.createdAt ) - (a.item.updatedAt || a.item.createdAt ));

        // Determine if there are more items to fetch
        const hasMore = (friendsRecentPlays.hasNextPage || friendsLibraryItems.hasNextPage);

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
        .populate('game')

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
                    totalWins: { $sum: { $cond: { if: { $arrayElemAt: ['$players.winner', 0] }, then: 1, else: 0 } } },
                    avgWinRate: { $avg: { $cond: { if: { $arrayElemAt: ['$players.winner', 0] }, then: 1, else: 0 } } },
                    avgScore: { $avg: { $avg: '$players.score' } }
                }
            }
        ]);

        // just a few random games for now
        const recommended = await Game.aggregate(
            [ { $sample: { size: 15 } } ]
        )

        // const newGames = await Game
        // .find()
        // .sort({ yearPublished: -1 })
        // .limit(15)
        // most played
        const mostPlayed = await Library.aggregate([
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        return res.status(200).json({
            data: {
                recentlyPlayed,
                // newGames,
                mostPlayed,
                playStats: playStats[0],
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
// @access Private
const getGeneralHomeFeed = async (req, res) => {
    try {
        // just a few random games for now
        const recommended = await Game.aggregate(
            [ { $sample: { size: 15 } } ]
        )

        // most played
        const mostPlayed = await Library.aggregate([
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        const mostFavorite = await Library.aggregate([
            { $match: { tags: 'Favorite' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        const mostOwned = await Library.aggregate([
            { $match: { tags: 'Owned' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        const mostWanted = await Library.aggregate([
            { $match: { tags: 'Wishlist' } },
            { $group: { _id: '$game', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
            { $unwind: '$game' }
        ]);

        return res.status(200).json({
            data: {
                recommended,
                mostPlayed,
                mostFavorite,
                mostOwned,
                mostWanted
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getCommunityFeed,
    getGeneralHomeFeed,
    getHomeFeed
}
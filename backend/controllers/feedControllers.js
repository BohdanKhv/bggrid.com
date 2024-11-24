const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Library = require('../models/libraryModel');
const Play = require('../models/playModel');
const Friend = require('../models/friendModel');


// @desc    Get community feed
// @route   GET /api/feed/community
// @access  Private
const getCommunityFeed = async (req, res) => {
    const { page = 1, limit = 10, type = 'all' } = req.query;

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



module.exports = {
    getCommunityFeed,
}
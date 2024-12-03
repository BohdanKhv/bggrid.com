const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getPublishers,
    getPublisherById
} = require('../controllers/publisherControllers.js');


router
    .get('/', getPublishers)
    .get('/:publisherId', getPublisherById)


module.exports = router;
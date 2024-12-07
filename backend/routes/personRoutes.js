const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getPersons,
    getPersonById
} = require('../controllers/personControllers.js');


router
    .get('/', getPersons)
    .get('/:personId', getPersonById)


module.exports = router;
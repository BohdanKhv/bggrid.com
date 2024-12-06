const express = require('express');
const router = express.Router();
const { protect, loggedIn } = require('../middleware/authMiddleware');
const {
    getDesigners,
    getDesignerById
} = require('../controllers/designerControllers.js');


router
    .get('/', getDesigners)
    .get('/:designerId', getDesignerById)


module.exports = router;
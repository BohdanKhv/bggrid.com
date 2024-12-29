const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    caption: { type: String, required: false },
    image: { type: String, required: true },
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
}, { timestamps: true });


module.exports = mongoose.model('Image', imageSchema);
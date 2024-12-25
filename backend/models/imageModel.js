const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    caption: { type: String, required: false },
    image: { type: String, required: true },
    thumbnail: { type: String, required: false },
    tags: [{ type: String, required: false }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    postedDate: { type: Date, required: false },
}, { timestamps: true });


module.exports = mongoose.model('Image', imageSchema);
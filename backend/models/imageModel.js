const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    thumbnail: { type: String, required: false },
    tags: [{ type: String, required: false }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    postedDate: { type: Date, required: false },
}, { timestamps: true });


module.exports = mongoose.model('Image', imageSchema);
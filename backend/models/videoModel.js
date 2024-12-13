const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({
    title: { type: String, required: false },
    link: { type: String, required: false },
    tags: [{ type: String, required: false }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    language: { type: String, required: false },
    postedDate: { type: Date, required: false },
}, { timestamps: true });


module.exports = mongoose.model('Video', videoSchema);
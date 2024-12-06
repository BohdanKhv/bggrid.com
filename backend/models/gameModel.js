const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    types: [{ type: String, required: true }],
    mechanics: [{ type: String, required: true }],
    themes: [{ type: String, required: true }],
    designers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Designer' }],
    publishers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' }],
    rules: { type: String, required: false },
    bggId: { type: Number, required: false },
    verified: { type: Boolean, required: false, default: false },
    thumbnail: { type: String, required: false },
    minPlayers: { type: Number, required: false },
    maxPlayers: { type: Number, required: false },
    avgPlaytime: { type: Number, required: false },
    minPlaytime: { type: Number, required: false },
    maxPlaytime: { type: Number, required: false },
    minAge: { type: Number, required: false },
    weight: { type: Number, required: false },
    languageDependence: { type: Number, required: false },
    rating: { type: Number, required: false },
    numRatings: { type: Number, required: false },
    numComments: { type: Number, required: false },
    images: [{ type: String, required: false }],
    videos: [{ type: String, required: false }],
}, { timestamps: true });


gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Game', gameSchema);
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    altNames: [{ type: String, required: false }], // alternative names
    description: { type: String, required: false },
    year: { type: Number, required: true },
    categories: [{ type: String, required: true }], // all possible categories
    types: [{ type: String, required: true }], // Focus on the overall experience or purpose of the game.
    mechanics: [{ type: String, required: true }], // Focus on specific gameplay systems or actions.
    themes: [{ type: String, required: true }], // Focus on the setting or narrative of the game.
    publishers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' }], // publisher id
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
    designers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
    altPublishers: [{ type: String, required: false }], // alternative designers
    altDesigners: [{ type: String, required: false }], // alternative designers
    altArtists: [{ type: String, required: false }], // alternative artists
    rules: { type: String, required: false }, // rules text
    rulesUrl: { type: String, required: false }, // rules pdf link if available
    verified: { type: Boolean, required: false, default: false }, // verified by admin
    thumbnail: { type: String, required: false }, // thumbnail image for the game
    image: { type: String, required: false }, // image link for the game
    minPlayers: { type: Number, required: false },
    maxPlayers: { type: Number, required: false },
    minPlayersRec: { type: Number, required: false },
    maxPlayersRec: { type: Number, required: false },
    minPlayersBest: { type: Number, required: false },
    maxPlayersBest: { type: Number, required: false },
    minPlaytime: { type: Number, required: false },
    maxPlaytime: { type: Number, required: false },
    minAge: { type: Number, required: false },
    minAgeRec: { type: Number, required: false },
    complexityWeight: { type: Number, required: false },
    languageDependence: { type: Number, required: false },
    rating: { type: Number, required: false },
    numRatings: { type: Number, required: false },
    numComments: { type: Number, required: false },
    buyUrl: { type: String, required: false },
    bggId: { type: String, required: false }, // boardgamegeek id
    isExpansion: { type: Boolean, required: false, default: false },
}, { timestamps: true });

gameSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Game', gameSchema);
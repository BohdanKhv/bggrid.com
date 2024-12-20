const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const playSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: false },
    playTimeMinutes: { type: Number, required: false },
    players: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // in case you tagged a user
        name: { type: String, required: true }, // in case the user is not registered
        score: { type: Number, required: false },
        color: { type: String, required: false },
        comment: { type: String, required: false },
        winner: { type: Boolean, required: false },
    }],
    playDate: { type: Date, required: false, default: Date.now },
}, { timestamps: true });


playSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Play', playSchema);

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    verified: { type: Boolean, required: false, default: false },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: false },
}, { timestamps: true });


gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Game', gameSchema);
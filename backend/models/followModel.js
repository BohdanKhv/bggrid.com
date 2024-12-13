const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const followSchema = new mongoose.Schema({
    // user who is following
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // user who is being followed
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the follow relationship was created
        },
    },
    {
        timestamps: false, // Disable automatic `createdAt` and `updatedAt` fields, since `createdAt` is explicitly defined
    }
);


// Prevent duplicate follow relationships
followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Follow', followSchema);

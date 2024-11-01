const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const resetTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
}, { timestamps: true });


resetTokenSchema.pre('save', function (next) {
    const resetToken = this;

    if (resetToken.isModified('token')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(resetToken.token, salt, (err, hash) => {
                resetToken.token = hash;
                next();
            });
        });
    } else {
        next();
    }
});


module.exports = mongoose.model('ResetToken', resetTokenSchema);
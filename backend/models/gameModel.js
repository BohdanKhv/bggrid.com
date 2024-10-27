const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    verified: { type: Boolean, required: false, default: false },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: false },
}, { timestamps: true });


module.exports = mongoose.model('Applicant', applicantSchema);
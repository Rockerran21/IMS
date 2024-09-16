const mongoose = require('mongoose');

const employmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    employerName: { type: String, required: true },
    title: { type: String, required: true },
    currentEmployer: { type: Boolean, default: false }
});

const Employment = mongoose.models.Employment || mongoose.model('Employment', employmentSchema);
module.exports = Employment;

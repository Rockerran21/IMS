const mongoose = require('mongoose');

const employmentSchema = new mongoose.Schema({
    employerName: { type: String, required: true },
    currentEmployer: { type: Boolean, default: false },
    currentField: { type: String },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

const Employment = mongoose.models.Employment || mongoose.model('Employment', employmentSchema);
module.exports = Employment;
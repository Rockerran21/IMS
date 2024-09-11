const mongoose = require('mongoose');

const employmentSchema = new mongoose.Schema({
    employerName: { type: String, required: true },
    currentEmployer: { type: Boolean, default: false },
    currentField: { type: String },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

module.exports = mongoose.model('Employment', employmentSchema);
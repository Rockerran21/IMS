const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    skillsObtained: { type: [String], required: false },
    currentEmployer: { type: String, required: false },
    jobRole: { type: String, required: false },
    faculty: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);

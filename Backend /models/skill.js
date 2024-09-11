const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillName: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] // Ensure this is an array of ObjectIds
});

// Ensure students array is properly initialized
skillSchema.pre('save', function (next) {
    if (!this.students) {
        this.students = [];
    }
    next();
});

module.exports = mongoose.model('Skill', skillSchema);

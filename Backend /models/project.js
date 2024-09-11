const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

module.exports = mongoose.model('Project', projectSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

module.exports = Project;
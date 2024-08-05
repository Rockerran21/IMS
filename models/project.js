const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    ProjectID: { type: Number, required: true, unique: true },
    ProjectName: { type: String, required: true },
    Description: { type: String, required: true },
    StudentID: { type: Number, required: true }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

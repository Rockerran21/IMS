const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bachelorSubject: String,
    highSchool: String,
    grade10School: String,
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }],
    employments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employment' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], // Ensure this is defined as an array of ObjectIds
    profilePhoto: {
        data: Buffer,
        contentType: String
    }
});
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
module.exports = Student;
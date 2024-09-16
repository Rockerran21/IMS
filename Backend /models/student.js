const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
    bachelorSubject: String,
    dateOfEnrollment: Date,
    currentSemester: Number,
    highSchool: String,
    grade10School: String,
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }],
    employments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employment' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    profilePhoto: {
        data: Buffer,
        contentType: String
    }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
module.exports = Student;

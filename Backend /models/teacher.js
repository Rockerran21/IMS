const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bachelorDegree: String,
    masterDegree: String,
    bachelorSubject: String,
    masterSubject: String,
    linkedInProfile: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

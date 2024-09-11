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

if (mongoose.models.Teacher) {
    module.exports = mongoose.model('Teacher');
} else {
    module.exports = mongoose.model('Teacher', teacherSchema);
}

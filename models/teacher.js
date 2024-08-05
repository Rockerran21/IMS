const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    TeacherID: { type: Number, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
    BachelorDegree: String,
    MasterDegree: String,
    BachelorSubject: String,
    MasterSubject: String,
    LinkedInProfile: String
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    StudentID: { type: Number, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
    CurrentEmployer: String,
    PastEmployer: String,
    CurrentField: String,
    BachlorSubject: String,
    HighSchoolGraduated: String,
    Grade10Schools: String,
    FinalProject: String,
    LinkedInProfile: String
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

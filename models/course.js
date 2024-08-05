const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    CourseID: { type: Number, required: true, unique: true },
    CourseName: { type: String, required: true },
    Description: { type: String, required: true },
    TeacherID: { type: Number, required: true }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

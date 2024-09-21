const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    description: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }

});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

module.exports = Course;


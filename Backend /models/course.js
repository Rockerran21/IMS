const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    description: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }

});

if (mongoose.models.Course) {
    module.exports = mongoose.model('Course');
} else {
    module.exports = mongoose.model('Course', courseSchema);
}



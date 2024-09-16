const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

skillSchema.pre('save', function (next) {
    if (!this.students) {
        this.students = [];
    }
    next();
});

// Drop existing indexes
mongoose.connection.collections['skills']?.dropIndexes().catch(err => console.log('No indexes to drop on skills collection'));

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

module.exports = Skill;
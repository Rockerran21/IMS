const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSkillSchema = new Schema({
    StudentID: { type: Number, required: true },
    SkillID: { type: Number, required: true }
});

const StudentSkill = mongoose.model('StudentSkill', studentSkillSchema);
module.exports = StudentSkill;

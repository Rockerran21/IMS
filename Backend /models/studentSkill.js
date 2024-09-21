const mongoose = require('mongoose');

const studentSkillSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }
});

if (mongoose.models.StudentSkill) {
    module.exports = mongoose.model('StudentSkill');
} else {
    module.exports = mongoose.model('StudentSkill', studentSkillSchema);
}

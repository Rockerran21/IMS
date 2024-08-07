const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    SkillID: { type: Number, required: true, unique: true },
    SkillName: { type: String, required: true }
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;

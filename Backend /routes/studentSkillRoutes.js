const express = require('express');
const router = express.Router();
const StudentSkill = require('../models/StudentSkill');

// Get all student skills
router.get('/', async (req, res) => {
    try {
        const studentSkills = await StudentSkill.find().populate('studentId skillId');
        res.json(studentSkills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get student skills by student ID
router.get('/student/:studentId', async (req, res) => {
    try {
        const studentSkills = await StudentSkill.find({ studentId: req.params.studentId }).populate('skillId');
        res.json(studentSkills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one student skill
router.post('/', async (req, res) => {
    const studentSkill = new StudentSkill(req.body);
    try {
        const newStudentSkill = await studentSkill.save();
        res.status(201).json(newStudentSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one student skill
router.delete('/:studentId/:skillId', async (req, res) => {
    try {
        await StudentSkill.findOneAndDelete({
            studentId: req.params.studentId,
            skillId: req.params.skillId
        });
        res.json({ message: 'Deleted StudentSkill' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
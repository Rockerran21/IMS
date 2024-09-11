const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one skill
router.get('/:id', getSkill, (req, res) => {
    res.json(res.skill);
});

// Create one skill
router.post('/', async (req, res) => {
    const skill = new Skill(req.body);
    try {
        const newSkill = await skill.save();
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one skill
router.patch('/:id', getSkill, async (req, res) => {
    if (req.body.skillName != null) {
        res.skill.skillName = req.body.skillName;
    }
    try {
        const updatedSkill = await res.skill.save();
        res.json(updatedSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one skill
router.delete('/:id', getSkill, async (req, res) => {
    try {
        await res.skill.remove();
        res.json({ message: 'Deleted Skill' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get skill by ID
async function getSkill(req, res, next) {
    let skill;
    try {
        skill = await Skill.findById(req.params.id);
        if (skill == null) {
            return res.status(404).json({ message: 'Cannot find skill' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.skill = skill;
    next();
}

module.exports = router;
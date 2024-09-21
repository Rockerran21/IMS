const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one teacher
router.get('/:id', getTeacher, (req, res) => {
    res.json(res.teacher);
});

// Create one teacher
router.post('/', async (req, res) => {
    const teacher = new Teacher(req.body);
    try {
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one teacher
router.patch('/:id', getTeacher, async (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            res.teacher[key] = req.body[key];
        }
    });
    try {
        const updatedTeacher = await res.teacher.save();
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one teacher
router.delete('/:id', getTeacher, async (req, res) => {
    try {
        await res.teacher.remove();
        res.json({ message: 'Deleted Teacher' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get teacher by ID
async function getTeacher(req, res, next) {
    let teacher;
    try {
        teacher = await Teacher.findById(req.params.id);
        if (teacher == null) {
            return res.status(404).json({ message: 'Cannot find teacher' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.teacher = teacher;
    next();
}

module.exports = router;
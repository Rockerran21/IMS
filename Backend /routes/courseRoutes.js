const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('teacherId');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one course
router.get('/:id', getCourse, (req, res) => {
    res.json(res.course);
});

// Create one course
router.post('/', async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one course
router.patch('/:id', getCourse, async (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            res.course[key] = req.body[key];
        }
    });
    try {
        const updatedCourse = await res.course.save();
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one course
router.delete('/:id', getCourse, async (req, res) => {
    try {
        await res.course.remove();
        res.json({ message: 'Deleted Course' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get course by ID
async function getCourse(req, res, next) {
    let course;
    try {
        course = await Course.findById(req.params.id).populate('teacherId');
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.course = course;
    next();
}

module.exports = router;
// routes/StudentRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/student');
const upload = require('../models/photos'); // GridFS and multer configuration for file upload

// Add a new student with photo upload
router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const { firstName, lastName, graduationYear, jobRole, currentEmployer, skillsObtained } = req.body;

        // Create student with photo linked by GridFS file id
        const newStudent = new Student({
            firstName,
            lastName,
            graduationYear,
            jobRole,
            currentEmployer,
            skillsObtained: skillsObtained ? skillsObtained.split(',') : [],
            photoId: req.file.id // Link to the uploaded photo's GridFS file ID
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully', student: newStudent });
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: 'Error saving student' });
    }
});

module.exports = router;

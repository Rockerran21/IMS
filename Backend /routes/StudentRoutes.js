const express = require('express');
const Student = require('../models/student');
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a student
router.post('/', async (req, res) => {
    const student = new Student({
        StudentID: req.body.StudentID,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        CurrentEmployer: req.body.CurrentEmployer,
        PastEmployer: req.body.PastEmployer,
        CurrentField: req.body.CurrentField,
        BachlorSubject: req.body.BachlorSubject,
        HighSchoolGraduated: req.body.HighSchoolGraduated,
        Grade10Schools: req.body.Grade10Schools,
        FinalProject: req.body.FinalProject,
        LinkedInProfile: req.body.LinkedInProfile
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

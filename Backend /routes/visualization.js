const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Route to get graduation year data
router.get('/graduationYear/:faculty', async (req, res) => {
    const faculty = req.params.faculty;
    console.log('Received faculty:', faculty); // Log the received faculty value

    try {
        // Fetch students based on the faculty provided
        const students = await Student.find({ faculty });
        console.log('Students Found:', students);

        if (!students.length) {
            console.log(`No students found for faculty: ${faculty}`);
            return res.status(404).json({ message: `No students found for faculty: ${faculty}` });
        }

        // Extract graduation years from the students
        const graduationYears = students.map(student => student.graduationYear);
        console.log('Fetched Graduation Years:', graduationYears);

        // Filter out any invalid or missing graduation years
        const validYears = graduationYears.filter(year => year !== undefined && year !== null);
        const uniqueYears = [...new Set(validYears)];

        const data = {
            labels: uniqueYears,
            values: uniqueYears.map(year => validYears.filter(y => y === year).length),
            label: 'Graduation Year'
        };

        console.log('Data to send:', data); // Log the data being sent to the frontend
        res.json(data);
    } catch (error) {
        console.error('Error fetching graduation year data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get job role data
router.get('/jobRole/:faculty', async (req, res) => {
    const faculty = req.params.faculty;
    try {
        const students = await Student.find({ faculty });
        const jobRoles = students.map(student => student.jobRole);
        const uniqueRoles = [...new Set(jobRoles)];

        const data = {
            labels: uniqueRoles,
            values: uniqueRoles.map(role => jobRoles.filter(r => r === role).length),
            label: 'Job Role'
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get current employer data
router.get('/currentEmployer/:faculty', async (req, res) => {
    const faculty = req.params.faculty;
    try {
        const students = await Student.find({ faculty });
        const currentEmployers = students.map(student => student.currentEmployer);
        const uniqueEmployers = [...new Set(currentEmployers)];

        const data = {
            labels: uniqueEmployers,
            values: uniqueEmployers.map(employer => currentEmployers.filter(e => e === employer).length),
            label: 'Current Employer'
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get skills obtained data
router.get('/skillsObtained/:faculty', async (req, res) => {
    const faculty = req.params.faculty;
    try {
        const students = await Student.find({ faculty });
        const skills = students.map(student => student.skillsObtained).flat();
        const uniqueSkills = [...new Set(skills)];

        const data = {
            labels: uniqueSkills,
            values: uniqueSkills.map(skill => skills.filter(s => s === skill).length),
            label: 'Skills Obtained'
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

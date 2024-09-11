const express = require('express');
const router = express.Router();
const Employment = require('../models/Employment');

// Get all employments
router.get('/', async (req, res) => {
    try {
        const employments = await Employment.find().populate('studentId');
        res.json(employments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one employment
router.get('/:id', getEmployment, (req, res) => {
    res.json(res.employment);
});

// Create one employment
router.post('/', async (req, res) => {
    const employment = new Employment(req.body);
    try {
        const newEmployment = await employment.save();
        res.status(201).json(newEmployment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one employment
router.patch('/:id', getEmployment, async (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            res.employment[key] = req.body[key];
        }
    });
    try {
        const updatedEmployment = await res.employment.save();
        res.json(updatedEmployment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one employment
router.delete('/:id', getEmployment, async (req, res) => {
    try {
        await res.employment.remove();
        res.json({ message: 'Deleted Employment' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get employment by ID
async function getEmployment(req, res, next) {
    let employment;
    try {
        employment = await Employment.findById(req.params.id).populate('studentId');
        if (employment == null) {
            return res.status(404).json({ message: 'Cannot find employment' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.employment = employment;
    next();
}

module.exports = router;
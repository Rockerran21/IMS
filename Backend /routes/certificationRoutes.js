const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');

// Get all certifications
router.get('/', async (req, res) => {
    try {
        const certifications = await Certification.find().populate('studentId');
        res.json(certifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one certification
router.get('/:id', getCertification, (req, res) => {
    res.json(res.certification);
});

// Create one certification
router.post('/', async (req, res) => {
    const certification = new Certification(req.body);
    try {
        const newCertification = await certification.save();
        res.status(201).json(newCertification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one certification
router.patch('/:id', getCertification, async (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            res.certification[key] = req.body[key];
        }
    });
    try {
        const updatedCertification = await res.certification.save();
        res.json(updatedCertification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one certification
router.delete('/:id', getCertification, async (req, res) => {
    try {
        await res.certification.remove();
        res.json({ message: 'Deleted Certification' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get certification by ID
async function getCertification(req, res, next) {
    let certification;
    try {
        certification = await Certification.findById(req.params.id).populate('studentId');
        if (certification == null) {
            return res.status(404).json({ message: 'Cannot find certification' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.certification = certification;
    next();
}

module.exports = router;
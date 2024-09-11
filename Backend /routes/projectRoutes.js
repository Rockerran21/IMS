const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('studentId');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one project
router.get('/:id', getProject, (req, res) => {
    res.json(res.project);
});

// Create one project
router.post('/', async (req, res) => {
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one project
router.patch('/:id', getProject, async (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            res.project[key] = req.body[key];
        }
    });
    try {
        const updatedProject = await res.project.save();
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one project
router.delete('/:id', getProject, async (req, res) => {
    try {
        await res.project.remove();
        res.json({ message: 'Deleted Project' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get project by ID
async function getProject(req, res, next) {
    let project;
    try {
        project = await Project.findById(req.params.id).populate('studentId');
        if (project == null) {
            return res.status(404).json({ message: 'Cannot find project' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.project = project;
    next();
}

module.exports = router;
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// CRUD Operations
router.get('/', auth, adminOnly, studentController.getAllStudents);
router.get('/:id', auth, studentController.getStudentById);
router.post('/', auth, adminOnly, studentController.createStudent);
router.put('/:id', auth, adminOnly, studentController.updateStudent);
router.delete('/:id', auth, adminOnly, studentController.deleteStudent);

// Additional operations
router.get('/:id/certifications', auth, studentController.getStudentCertifications);
router.get('/:id/employments', auth, studentController.getStudentEmployments);
router.get('/:id/projects', auth, studentController.getStudentProjects);
router.get('/:id/skills', auth, studentController.getStudentSkills);

router.post('/:id/certifications', auth, studentController.addStudentCertification);
router.post('/:id/employments', auth, studentController.addStudentEmployment);
router.post('/:id/projects', auth, studentController.addStudentProject);
router.post('/:id/skills', auth, studentController.addStudentSkill);

// Photo upload
router.post('/:id/photo', auth, upload.single('photoUpload'), studentController.uploadPhoto);

// Get own student profile (for regular users)
router.get('/me', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
const Student = require('../models/Student');
const Certification = require('../models/Certification');
const Employment = require('../models/Employment');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('certifications employments projects skills');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('certifications employments projects skills');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createStudent = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        console.log('Received full student data:', JSON.stringify(req.body, null, 2));
        const { certifications, employments, projects, ...studentData } = req.body;

        console.log('Creating new student with data:', JSON.stringify(studentData, null, 2));
        const student = new Student(studentData);
        await student.save({ session });

        if (Array.isArray(certifications) && certifications.length > 0) {
            console.log('Processing certifications:', JSON.stringify(certifications, null, 2));
            const certDocs = await Certification.create(certifications.map(cert => ({ ...cert, studentId: student._id })), { session });
            student.certifications = certDocs.map(doc => doc._id);
        }

        if (Array.isArray(employments) && employments.length > 0) {
            console.log('Processing employments:', JSON.stringify(employments, null, 2));
            const empDocs = await Employment.create(employments.map(emp => ({ ...emp, studentId: student._id })), { session });
            student.employments = empDocs.map(doc => doc._id);
        }

        if (Array.isArray(projects) && projects.length > 0) {
            console.log('Processing projects:', JSON.stringify(projects, null, 2));
            const projDocs = await Project.create(projects.map(proj => ({ ...proj, studentId: student._id })), { session });
            student.projects = projDocs.map(doc => doc._id);
        }

        console.log('Saving student with updated data:', JSON.stringify(student, null, 2));
        await student.save({ session });
        await session.commitTransaction();

        console.log('Student created successfully:', JSON.stringify(student, null, 2));
        const populatedStudent = await Student.findById(student._id).populate('certifications employments projects');
        res.status(201).json(populatedStudent);
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in createStudent:', err);
        console.error('Error stack:', err.stack);
        res.status(400).json({ message: err.message, stack: err.stack });
    } finally {
        session.endSession();
    }
};

exports.updateStudent = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const { certifications, employments, projects, skills, ...studentData } = req.body;

        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        Object.assign(student, studentData);

        if (certifications) {
            await Certification.deleteMany({ studentId: student._id }).session(session);
            const certDocs = await Certification.create(certifications.map(cert => ({ ...cert, studentId: student._id })), { session });
            student.certifications = certDocs.map(doc => doc._id);
        }

        if (employments) {
            await Employment.deleteMany({ studentId: student._id }).session(session);
            const empDocs = await Employment.create(employments.map(emp => ({ ...emp, studentId: student._id })), { session });
            student.employments = empDocs.map(doc => doc._id);
        }

        if (projects) {
            await Project.deleteMany({ studentId: student._id }).session(session);
            const projDocs = await Project.create(projects.map(proj => ({ ...proj, studentId: student._id })), { session });
            student.projects = projDocs.map(doc => doc._id);
        }

        if (skills) {
            await Skill.updateMany({ students: student._id }, { $pull: { students: student._id } }).session(session);
            const skillDocs = await Promise.all(skills.map(async (skillName) => {
                let skill = await Skill.findOne({ skillName }).session(session);
                if (!skill) {
                    skill = await Skill.create([{ skillName }], { session });
                }
                skill.students.addToSet(student._id);
                await skill.save({ session });
                return skill._id;
            }));
            student.skills = skillDocs;
        }

        await student.save({ session });
        await session.commitTransaction();

        const updatedStudent = await Student.findById(student._id).populate('certifications employments projects skills');
        res.json(updatedStudent);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.deleteStudent = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        await Certification.deleteMany({ studentId: student._id }).session(session);
        await Employment.deleteMany({ studentId: student._id }).session(session);
        await Project.deleteMany({ studentId: student._id }).session(session);
        await Skill.updateMany({ students: student._id }, { $pull: { students: student._id } }).session(session);

        await student.remove({ session });
        await session.commitTransaction();

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.getStudentCertifications = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('certifications');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student.certifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentEmployments = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('employments');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student.employments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentProjects = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('projects');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student.projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentSkills = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('skills');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student.skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addStudentCertification = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        const certification = new Certification({ ...req.body, studentId: student._id });
        await certification.save({ session });

        student.certifications.push(certification._id);
        await student.save({ session });

        await session.commitTransaction();

        res.status(201).json(certification);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.addStudentEmployment = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        const employment = new Employment({ ...req.body, studentId: student._id });
        await employment.save({ session });

        student.employments.push(employment._id);
        await student.save({ session });

        await session.commitTransaction();

        res.status(201).json(employment);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.addStudentProject = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        const project = new Project({ ...req.body, studentId: student._id });
        await project.save({ session });

        student.projects.push(project._id);
        await student.save({ session });

        await session.commitTransaction();

        res.status(201).json(project);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.addStudentSkill = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(req.params.id).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Student not found' });
        }

        let skill = await Skill.findOne({ skillName: req.body.skillName }).session(session);
        if (!skill) {
            skill = new Skill({ skillName: req.body.skillName });
            await skill.save({ session });
        }

        if (!student.skills.includes(skill._id)) {
            student.skills.push(skill._id);
            await student.save({ session });
        }

        if (!skill.students.includes(student._id)) {
            skill.students.push(student._id);
            await skill.save({ session });
        }

        await session.commitTransaction();

        res.status(201).json(skill);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};
exports.createStudent = async (req, res) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        const { certifications, employments, projects, skills, ...studentData } = req.body;

        const student = new Student(studentData);
        await student.save({ session });

        if (certifications) {
            const certDocs = await Certification.create(certifications.map(cert => ({ ...cert, studentId: student._id })), { session });
            student.certifications = certDocs.map(doc => doc._id);
            console.log('Received certification data:', req.body.certifications);
        }

        if (employments) {
            const empDocs = await Employment.create(employments.map(emp => ({ ...emp, studentId: student._id })), { session });
            student.employments = empDocs.map(doc => doc._id);
            console.log('Received employment data:', req.body.employments);
        }

        if (projects) {
            const projDocs = await Project.create(projects.map(proj => ({ ...proj, studentId: student._id })), { session });
            student.projects = projDocs.map(doc => doc._id);
            console.log('Received project data:', req.body.projects);
        }

        if (skills) {
            const skillDocs = await Promise.all(skills.map(async (skillName) => {
                let skill = await Skill.findOne({ skillName });
                if (!skill) {
                    skill = await Skill.create([{ skillName }], { session });
                }
                skill.students.push(student._id);
                await skill.save({ session });
                return skill._id;
            }));
            student.skills = skillDocs;
        }
        console.log('Recieved Student data ', req.body.students);
        await student.save({ session });
        await session.commitTransaction();

        const populatedStudent = await Student.findById(student._id).populate('certifications employments projects skills');
        res.status(201).json(populatedStudent);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

// New method to handle photo uploads
exports.uploadPhoto = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        student.profilePhoto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        await student.save();
        res.status(200).json({ message: 'Photo uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = exports;
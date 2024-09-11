const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');

exports.getDashboardData = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalFaculty = await Teacher.countDocuments();
        const coursesOffered = await Course.countDocuments();

        const departmentData = {
            BCS: await Student.countDocuments({ department: 'BCS' }),
            BHM: await Student.countDocuments({ department: 'BHM' }),
            BBA: await Student.countDocuments({ department: 'BBA' })
        };

        const genderData = {
            male: await Student.countDocuments({ gender: 'Male' }),
            female: await Student.countDocuments({ gender: 'Female' })
        };

        res.json({
            totalStudents,
            totalFaculty,
            coursesOffered,
            departmentData,
            genderData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
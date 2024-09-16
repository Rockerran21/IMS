const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

exports.getDashboardData = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalFaculty = await Teacher.countDocuments();
        const coursesOffered = await Course.countDocuments();

        const departmentData = {
            BCS: await Student.countDocuments({ bachelorSubject: 'BCS' }),
            BHM: await Student.countDocuments({ bachelorSubject: 'BHM' }),
            BBA: await Student.countDocuments({ bachelorSubject: 'BBA' })
        };

        const genderData = {
            male: await Student.countDocuments({ gender: 'male' }),
            female: await Student.countDocuments({ gender: 'female' })
        };

        const currentYear = new Date().getFullYear();
        const enrollmentTrend = {
            '2020': await Student.countDocuments({ admissionYear: 2020 }),
            '2021': await Student.countDocuments({ admissionYear: 2021 }),
            '2022': await Student.countDocuments({ admissionYear: 2022 }),
            '2023': await Student.countDocuments({ admissionYear: 2023 }),
            '2024': await Student.countDocuments({ admissionYear: 2024 })
        };

        res.json({
            totalStudents,
            totalFaculty,
            coursesOffered,
            departmentData,
            genderData,
            enrollmentTrend
        });
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ message: error.message });
    }
};
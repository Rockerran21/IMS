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

        const genderData = await Student.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        const currentYear = new Date().getFullYear();
        const enrollmentTrend = await Student.aggregate([
            {
                $group: {
                    _id: { $year: "$dateOfEnrollment" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const enrollmentTrendData = enrollmentTrend.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        res.json({
            totalStudents,
            totalFaculty,
            coursesOffered,
            departmentData,
            genderData,
            enrollmentTrendData
        });
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ message: error.message });
    }
};
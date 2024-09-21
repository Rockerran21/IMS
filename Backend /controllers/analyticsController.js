const Student = require('../models/Student');
const Certification = require('../models/Certification');
const Employment = require('../models/Employment');
const Skill = require('../models/Skill');

exports.getAnalyticsData = async (req, res) => {
    try {
        // Enrollment Trend
        const enrollmentTrend = await Student.aggregate([
            {
                $group: {
                    _id: { $year: "$dateOfEnrollment" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Department Distribution
        const departmentDistribution = await Student.aggregate([
            {
                $group: {
                    _id: "$bachelorSubject",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Gender Distribution
        const genderDistribution = await Student.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Top 5 Skills
        const topSkills = await Student.aggregate([
            { $unwind: "$skills" },
            { $lookup: {
                from: "skills",
                localField: "skills",
                foreignField: "_id",
                as: "skillInfo"
            }},
            { $unwind: "$skillInfo" },
            { $group: { _id: "$skillInfo.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Certification Statistics
        const certificationStats = await Certification.aggregate([
            { $group: { _id: "$certificationName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Employment Rate
        const totalStudents = await Student.countDocuments();
        const employedStudents = await Employment.countDocuments();
        const employmentRate = Math.min((employedStudents / totalStudents) * 100, 100);

        res.json({
            enrollmentTrend,
            departmentDistribution,
            genderDistribution,
            topSkills,
            certificationStats,
            employmentRate: employmentRate.toFixed(2)
        });
    } catch (error) {
        console.error('Error in getAnalyticsData:', error);
        res.status(500).json({ message: error.message });
    }
};
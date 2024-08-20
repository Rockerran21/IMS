const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/student');
const Teacher = require('./models/teacher');
const Project = require('./models/project');
const Certification = require('./models/certification');
const Employment = require('./models/employment');
const Skill = require('./models/skill');
const StudentSkill = require('./models/studentSkill');
const Course = require('./models/course');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'IMSDatabase' })
    .then(async () => {
        console.log('Connected to MongoDB Atlas');

        // Clear existing data
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Project.deleteMany({});
        await Certification.deleteMany({});
        await Employment.deleteMany({});
        await Skill.deleteMany({});
        await StudentSkill.deleteMany({});
        await Course.deleteMany({});

        console.log('Existing data removed');

        // Populate Students
        const students = [
            {
                StudentID: 1,
                FirstName: 'John',
                LastName: 'Doe',
                Email: 'john.doe@example.com',
                CurrentEmployer: 'TechCorp',
                PastEmployer: 'Innovate Inc.',
                CurrentField: 'Software Development',
                BachlorSubject: 'Computer Science',
                HighSchoolGraduated: 'Lincoln High',
                Grade10Schools: 'Central Middle School',
                FinalProject: 'AI Chatbot',
                LinkedInProfile: 'https://linkedin.com/in/johndoe'
            }
        ];
        await Student.insertMany(students);

        // Populate Teachers
        const teachers = [
            {
                TeacherID: 1,
                FirstName: 'Jane',
                LastName: 'Smith',
                Email: 'jane.smith@example.com',
                BachelorDegree: 'Mathematics',
                MasterDegree: 'Statistics',
                BachelorSubject: 'Mathematics',
                MasterSubject: 'Statistics',
                LinkedInProfile: 'https://linkedin.com/in/janesmith'
            }
        ];
        await Teacher.insertMany(teachers);

        // Populate Projects
        const projects = [
            {
                ProjectID: 1,
                ProjectName: 'AI Research',
                Description: 'Research on AI algorithms',
                StudentID: 1
            }
        ];
        await Project.insertMany(projects);

        // Populate Certifications
        const certifications = [
            {
                CertificationID: 1,
                CertificationName: 'AWS Certified',
                IssuingAuthority: 'Amazon',
                DateObtained: new Date('2022-01-01'),
                StudentID: 1
            }
        ];
        await Certification.insertMany(certifications);

        // Populate Employment
        const employments = [
            {
                EmploymentID: 1,
                StudentID: 1,
                EmployerName: 'TechCorp',
                StartDate: new Date('2021-01-01'),
                EndDate: new Date('2022-01-01'),
                JobTitle: 'Software Engineer',
                JobDescription: 'Developed web applications'
            }
        ];
        await Employment.insertMany(employments);

        // Populate Skills
        const skills = [
            {
                SkillID: 1,
                SkillName: 'JavaScript'
            },
            {
                SkillID: 2,
                SkillName: 'Python'
            }
        ];
        await Skill.insertMany(skills);

        // Populate StudentSkills
        const studentSkills = [
            {
                StudentID: 1,
                SkillID: 1
            },
            {
                StudentID: 1,
                SkillID: 2
            }
        ];
        await StudentSkill.insertMany(studentSkills);

        // Populate Courses
        const courses = [
            {
                CourseID: 1,
                CourseName: 'Intro to Programming',
                Description: 'Basics of programming',
                TeacherID: 1
            }
        ];
        await Course.insertMany(courses);

        console.log('Database populated with initial data');
        mongoose.connection.close();
    })
    .catch(err => console.log('Failed to connect to MongoDB Atlas:', err));

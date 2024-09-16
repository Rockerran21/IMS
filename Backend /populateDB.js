const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const Student = require('./models/Student');
const User = require('./models/User');
const Certification = require('./models/Certification');
const Employment = require('./models/Employment');
const Project = require('./models/Project');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Skill = require('./models/Skill');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
        // Drop all collections
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
        console.log('All collections dropped');

        // Create skills
        const skills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB', 'AWS', 'Docker'];
        const skillDocs = await Promise.all(skills.map(skillName => new Skill({ name: skillName }).save()));
        console.log('Skills created');

        // Generate and insert new student records
        const studentCount = 120;
        const departments = ['BCS', 'BHM', 'BBA'];
        const genders = ['Male', 'Female'];
        for (let i = 0; i < studentCount; i++) {
            const student = new Student({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                dateOfBirth: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
                bachelorSubject: faker.helpers.arrayElement(departments),
                highSchool: faker.company.name() + ' High School',
                grade10School: faker.company.name() + ' School',
                gender: faker.helpers.arrayElement(genders),
                admissionYear: faker.date.between({ from: '2020-01-01', to: '2024-12-31' }).getFullYear()
            });

            // Add certifications
            const certCount = faker.number.int({ min: 0, max: 3 });
            for (let j = 0; j < certCount; j++) {
                const cert = new Certification({
                    certificationName: faker.company.catchPhrase(),
                    issuingAuthority: faker.company.name(),
                    dateObtained: faker.date.past({ years: 5 }),
                    studentId: student._id
                });
                await cert.save();
                student.certifications.push(cert._id);
            }

            // Add employments
            const empCount = faker.number.int({ min: 0, max: 2 });
            for (let j = 0; j < empCount; j++) {
                const emp = new Employment({
                    employerName: faker.company.name(),
                    currentEmployer: j === 0,
                    currentField: faker.person.jobTitle(),
                    studentId: student._id
                });
                await emp.save();
                student.employments.push(emp._id);
            }

            // Add projects
            const projCount = faker.number.int({ min: 0, max: 4 });
            for (let j = 0; j < projCount; j++) {
                const proj = new Project({
                    projectName: faker.commerce.productName(),
                    description: faker.lorem.paragraph(),
                    studentId: student._id
                });
                await proj.save();
                student.projects.push(proj._id);
            }

            // Add skills
            const studentSkills = faker.helpers.arrayElements(skillDocs, { min: 1, max: 5 });
            student.skills = studentSkills.map(skill => skill._id);

            await student.save();

            // Create user account for student
            const userPassword = await bcrypt.hash('password123', 8); // Use a default password for easy testing
            await User.create({
                username: faker.internet.userName(),
                password: userPassword,
                email: student.email,
                phone: faker.phone.number(),
                role: 'user', // Changed from 'student' to 'user'
                studentId: student._id
            });

            console.log(`Created student ${i + 1} of ${studentCount}`);
        }

        // Create teachers and courses
        const teacherCount = 10;
        for (let i = 0; i < teacherCount; i++) {
            const teacher = new Teacher({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                department: faker.helpers.arrayElement(departments)
            });
            await teacher.save();

            // Create user account for teacher
            const userPassword = await bcrypt.hash('password123', 8); // Use a default password for easy testing
            await User.create({
                username: faker.internet.userName(),
                password: userPassword,
                email: teacher.email,
                phone: faker.phone.number(),
                role: 'user',
                teacherId: teacher._id
            });

            // Create 2-3 courses for each teacher
            const courseCount = faker.number.int({ min: 2, max: 3 });
            for (let j = 0; j < courseCount; j++) {
                const course = new Course({
                    courseName: faker.company.catchPhrase(), // Changed from 'name' to 'courseName'
                    code: faker.string.alphanumeric(6).toUpperCase(),
                    description: faker.lorem.sentence(),
                    credits: faker.number.int({ min: 1, max: 4 }),
                    teacherId: teacher._id
                });
                await course.save();
                teacher.courses.push(course._id);
            }
            await teacher.save();

            console.log(`Created teacher ${i + 1} of ${teacherCount}`);
        }

        // Create an admin user
        await User.create({
            username: 'admin',
            password: await bcrypt.hash('admin123', 8),
            email: 'admin@example.com',
            phone: faker.phone.number(),
            role: 'admin'
        });
        console.log('Admin user created');

        console.log('Database population complete');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        mongoose.connection.close();
    }
});
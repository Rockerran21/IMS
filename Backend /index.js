const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//Imports for respective api Calls
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const projectRoutes = require('./routes/projectRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const employmentRoutes = require('./routes/employmentRoutes');
const skillRoutes = require('./routes/skillRoutes');
const studentSkillRoutes = require('./routes/studentSkillRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
//API calls for respective database data fetching
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/employments', employmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/studentskills', studentSkillRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboards', dashboardRoutes);


// Middleware setup for various authentication functionality
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
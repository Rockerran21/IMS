const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());

const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server.database.windows.net',
    database: 'your_database',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

sql.connect(dbConfig).then(pool => {
    if (pool.connecting) {
        console.log('Connecting to the database...');
    }
    if (pool.connected) {
        console.log('Connected to the database.');
    }
}).catch(err => {
    console.error('Database connection failed: ', err);
});

app.get('/', (req, res) => {
    res.send('API is working');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Get all students
app.get('/students', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Student');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('StudentID', sql.Int, id)
            .query('SELECT * FROM Student WHERE StudentID = @StudentID');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a new student
app.post('/students', async (req, res) => {
    const { FirstName, LastName, Email, CurrentEmployer, PastEmployer, CurrentField, BachlorSubject, HighSchoolGraduated, Grade10Schools, FinalProject, LinkedInProfile } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('FirstName', sql.VarChar, FirstName)
            .input('LastName', sql.VarChar, LastName)
            .input('Email', sql.VarChar, Email)
            .input('CurrentEmployer', sql.VarChar, CurrentEmployer)
            .input('PastEmployer', sql.VarChar, PastEmployer)
            .input('CurrentField', sql.VarChar, CurrentField)
            .input('BachlorSubject', sql.VarChar, BachlorSubject)
            .input('HighSchoolGraduated', sql.VarChar, HighSchoolGraduated)
            .input('Grade10Schools', sql.VarChar, Grade10Schools)
            .input('FinalProject', sql.VarChar, FinalProject)
            .input('LinkedInProfile', sql.VarChar, LinkedInProfile)
            .query(`INSERT INTO Student (FirstName, LastName, Email, CurrentEmployer, PastEmployer, CurrentField, BachlorSubject, HighSchoolGraduated, Grade10Schools, FinalProject, LinkedInProfile)
                    VALUES (@FirstName, @LastName, @Email, @CurrentEmployer, @PastEmployer, @CurrentField, @BachlorSubject, @HighSchoolGraduated, @Grade10Schools, @FinalProject, @LinkedInProfile)`);
        res.status(201).send('Student added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a student
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Email, CurrentEmployer, PastEmployer, CurrentField, BachlorSubject, HighSchoolGraduated, Grade10Schools, FinalProject, LinkedInProfile } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('StudentID', sql.Int, id)
            .input('FirstName', sql.VarChar, FirstName)
            .input('LastName', sql.VarChar, LastName)
            .input('Email', sql.VarChar, Email)
            .input('CurrentEmployer', sql.VarChar, CurrentEmployer)
            .input('PastEmployer', sql.VarChar, PastEmployer)
            .input('CurrentField', sql.VarChar, CurrentField)
            .input('BachlorSubject', sql.VarChar, BachlorSubject)
            .input('HighSchoolGraduated', sql.VarChar, HighSchoolGraduated)
            .input('Grade10Schools', sql.VarChar, Grade10Schools)
            .input('FinalProject', sql.VarChar, FinalProject)
            .input('LinkedInProfile', sql.VarChar, LinkedInProfile)
            .query(`UPDATE Student SET 
                    FirstName = @FirstName, 
                    LastName = @LastName, 
                    Email = @Email, 
                    CurrentEmployer = @CurrentEmployer, 
                    PastEmployer = @PastEmployer, 
                    CurrentField = @CurrentField, 
                    BachlorSubject = @BachlorSubject, 
                    HighSchoolGraduated = @HighSchoolGraduated, 
                    Grade10Schools = @Grade10Schools, 
                    FinalProject = @FinalProject, 
                    LinkedInProfile = @LinkedInProfile 
                    WHERE StudentID = @StudentID`);
        res.send('Student updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('StudentID', sql.Int, id)
            .query('DELETE FROM Student WHERE StudentID = @StudentID');
        res.send('Student deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

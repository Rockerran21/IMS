const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employmentSchema = new Schema({
    EmploymentID: { type: Number, required: true, unique: true },
    StudentID: { type: Number, required: true },
    EmployerName: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    JobTitle: { type: String, required: true },
    JobDescription: { type: String, required: true }
});

const Employment = mongoose.model('Employment', employmentSchema);
module.exports = Employment;

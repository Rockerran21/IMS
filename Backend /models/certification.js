const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    certificationName: { type: String, required: true },
    issuingAuthority: String,
    dateObtained: Date,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

module.exports = mongoose.model('Certification', certificationSchema);
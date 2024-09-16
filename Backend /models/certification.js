const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    certificationName: { type: String, required: true },
    issuingAuthority: String,
    dateObtained: Date,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);

module.exports = Certification;
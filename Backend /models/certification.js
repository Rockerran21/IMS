const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    certificationName: { type: String, required: true },
    issuingAuthority: { type: String, required: true },
    dateObtained: { type: Date, required: true }
});

const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);
module.exports = Certification;

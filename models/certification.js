const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificationSchema = new Schema({
    CertificationID: { type: Number, required: true, unique: true },
    CertificationName: { type: String, required: true },
    IssuingAuthority: { type: String, required: true },
    DateObtained: { type: Date, required: true },
    StudentID: { type: Number, required: true }
});

const Certification = mongoose.model('Certification', certificationSchema);
module.exports = Certification;

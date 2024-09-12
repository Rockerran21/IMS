const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

if (mongoose.models.user) {
    module.exports = mongoose.model('User');
} else {
    module.exports = mongoose.model('User', userSchema);
}
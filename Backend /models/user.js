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
    resetPasswordExpires: Date,
    avatar: {
        data: Buffer,
        contentType: String
    },
    defaultDashboardView: { type: String, default: 'summary' },
    notificationPreference: { type: String, default: 'email' }
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
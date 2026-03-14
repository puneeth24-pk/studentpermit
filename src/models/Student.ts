import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._-]+@mits\.ac\.in$/i,
            'Please use a valid MITS college email ID',
        ],
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['student'],
        default: 'student',
    },
    resetPasswordOtp: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);

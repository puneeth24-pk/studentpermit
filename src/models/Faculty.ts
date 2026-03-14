import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema({
    facultyId: {
        type: String,
        required: [true, 'Please provide a Faculty ID'],
        unique: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['faculty'],
        default: 'faculty',
    },
}, { timestamps: true });

export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);

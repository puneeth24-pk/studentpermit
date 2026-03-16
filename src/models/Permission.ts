import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    location: {
        lat: { type: Number },
        lng: { type: Number },
    },
    time: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    // Auto-delete from MongoDB after 7 days (604800 seconds)
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        index: { expireAfterSeconds: 0 }, // TTL index: delete when expiresAt is reached
    },
}, { timestamps: true });

export default mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);

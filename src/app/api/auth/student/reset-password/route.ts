import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const student = await Student.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!student) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        student.passwordHash = await bcrypt.hash(newPassword, salt);

        // Clear OTP fields
        student.resetPasswordOtp = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        return NextResponse.json({ success: true, message: 'Password reset successful' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

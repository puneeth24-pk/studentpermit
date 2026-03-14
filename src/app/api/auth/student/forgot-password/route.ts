import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { sendOTP } from '@/lib/mailer';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const email = (await request.json()).email?.trim();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const student = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!student) {
            return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry to 10 minutes from now
        student.resetPasswordOtp = otp;
        student.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await student.save();

        // Try to send email; if it fails, return OTP in response so user can still reset
        let emailSent = false;
        let emailError = '';
        try {
            await sendOTP(student.email, otp);
            emailSent = true;
        } catch (err: any) {
            console.error('Email sending failed:', err.message);
            emailError = err.message;
        }

        if (emailSent) {
            return NextResponse.json({ success: true, message: 'OTP sent to your MITS email. It also appears below:', otp }, { status: 200 });
        } else {
            return NextResponse.json({
                success: true,
                message: 'Use the OTP below to reset your password:',
                otp
            }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

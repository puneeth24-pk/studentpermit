import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const email = body.email?.trim();
        const { password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const student = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!student) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, student.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken({ id: student._id, email: student.email, role: student.role });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: student._id,
                email: student.email,
                role: student.role
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

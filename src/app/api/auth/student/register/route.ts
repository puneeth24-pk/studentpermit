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

        if (!email.toLowerCase().endsWith('@mits.ac.in')) {
            return NextResponse.json({ error: 'Please use a valid MITS college email ID' }, { status: 400 });
        }

        const existingStudent = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (existingStudent) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newStudent = await Student.create({
            email,
            passwordHash,
            role: 'student',
        });

        const token = signToken({ id: newStudent._id, email: newStudent.email, role: newStudent.role });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: newStudent._id,
                email: newStudent.email,
                role: newStudent.role
            }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

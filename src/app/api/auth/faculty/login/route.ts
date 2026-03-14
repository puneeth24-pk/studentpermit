import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Faculty from '@/models/Faculty';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { facultyId, password } = body;

        if (!facultyId || !password) {
            return NextResponse.json({ error: 'Faculty ID and password are required' }, { status: 400 });
        }

        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, faculty.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken({ id: faculty._id, facultyId: faculty.facultyId, role: faculty.role });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: faculty._id,
                facultyId: faculty.facultyId,
                role: faculty.role
            }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

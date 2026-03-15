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

        const cleanFacultyId = facultyId?.trim() || "";
        const cleanPassword = password?.trim() || "";

        if (!cleanFacultyId || !cleanPassword) {
            return NextResponse.json({ error: 'Faculty ID and password are required' }, { status: 400 });
        }

        const faculty = await Faculty.findOne({ facultyId: { $regex: new RegExp(`^${cleanFacultyId}$`, 'i') } });
        if (!faculty) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(cleanPassword, faculty.passwordHash);
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
        console.error('Faculty Login Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

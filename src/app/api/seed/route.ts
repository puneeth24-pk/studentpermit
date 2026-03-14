import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Faculty from '@/models/Faculty';

export async function GET() {
    try {
        await dbConnect();

        const faculties = [
            { facultyId: 'faculty01', password: 'mits01' },
            { facultyId: 'faculty02', password: 'mits02' },
            { facultyId: 'faculty03', password: 'mits03' }
        ];

        for (const fac of faculties) {
            const existing = await Faculty.findOne({ facultyId: fac.facultyId });
            if (!existing) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(fac.password, salt);
                await Faculty.create({
                    facultyId: fac.facultyId,
                    passwordHash: hash,
                    role: 'faculty',
                });
            }
        }

        return NextResponse.json({ message: 'Seed run complete. Faculty accounts generated.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

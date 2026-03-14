import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Permission from '@/models/Permission';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // IST = UTC+5:30. Start of today in IST = today 00:00 IST = yesterday 18:30 UTC
        const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        const startOfTodayIST = new Date(Date.UTC(
            nowIST.getUTCFullYear(),
            nowIST.getUTCMonth(),
            nowIST.getUTCDate(),
            0, 0, 0, 0
        ) - 5.5 * 60 * 60 * 1000); // subtract 5:30 to convert back to UTC

        if (decoded.role === 'faculty') {
            // Show only today's (IST) permission letters
            const permissions = await Permission.find({
                createdAt: { $gte: startOfTodayIST }
            }).sort({ createdAt: -1 });
            return NextResponse.json({ success: true, permissions }, { status: 200 });
        }
        else if (decoded.role === 'student') {
            // Student can only see their own, today only
            const permissions = await Permission.find({
                studentEmail: decoded.email,
                createdAt: { $gte: startOfTodayIST }
            }).sort({ createdAt: -1 });
            return NextResponse.json({ success: true, permissions }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid Role' }, { status: 403 });

    } catch (error: any) {
        console.error('Permission Fetch Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = verifyToken(token);

        if (!decoded || decoded.role !== 'student') {
            return NextResponse.json({ error: 'Only students can create permission requests' }, { status: 403 });
        }

        const body = await request.json();
        const { name, rollNumber, purpose, fileUrl, location, time } = body;

        if (!name || !rollNumber || !purpose) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Protect MongoDB 500MB free tier - limit file size to 3MB
        const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB raw
        let safeFileUrl = '';
        if (fileUrl) {
            const base64Data = fileUrl.split(',')[1] || fileUrl;
            const approxBytes = Math.ceil(base64Data.length * 0.75);
            if (approxBytes > MAX_FILE_SIZE_BYTES) {
                return NextResponse.json({ error: 'File too large. Maximum allowed size is 150KB to protect storage.' }, { status: 413 });
            }
            safeFileUrl = fileUrl;
        }

        const newPermission = await Permission.create({
            studentEmail: decoded.email,
            name,
            rollNumber,
            purpose,
            fileUrl: safeFileUrl,
            location,
            time: time || new Date(),
            status: 'Pending',
        });

        return NextResponse.json({ success: true, permission: newPermission }, { status: 201 });

    } catch (error: any) {
        console.error('Permission Create Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

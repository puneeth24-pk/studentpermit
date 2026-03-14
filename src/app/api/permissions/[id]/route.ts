import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Permission from '@/models/Permission';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = verifyToken(token);

        // Only faculty can update the status
        if (!decoded || decoded.role !== 'faculty') {
            return NextResponse.json({ error: 'Forbidden: Faculty only' }, { status: 403 });
        }

        const body = await request.json();
        const { status } = body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const permissionId = params.id;
        const permission = await Permission.findByIdAndUpdate(
            permissionId,
            { status },
            { new: true }
        );

        if (!permission) {
            return NextResponse.json({ error: 'Permission request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, permission }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, CheckCircle, XCircle, FileDown, Map } from 'lucide-react';

export default function FacultyDashboard() {
    const router = useRouter();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('faculty_token');
        if (!token) {
            router.push('/login/faculty');
            return;
        }
        fetchPermissions(token);
    }, []);

    const fetchPermissions = async (token: string) => {
        try {
            const res = await fetch('/api/permissions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setPermissions(data.permissions);
            } else {
                if (res.status === 401 || res.status === 403) router.push('/login/faculty');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('faculty_token');
            const res = await fetch(`/api/permissions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setPermissions(permissions.map((p: any) =>
                    p._id === id ? { ...p, status: newStatus } : p
                ) as any);
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('faculty_token');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1b4b] text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-indigo-900/50">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-indigo-400" />
                        <span className="font-bold text-lg tracking-tight">Faculty Panel</span>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center gap-3 bg-indigo-600/20 text-indigo-300 px-4 py-3 rounded-lg font-medium transition-colors">
                                <LayoutDashboard className="h-5 w-5" />
                                All Requests
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-indigo-900/50">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-indigo-200 hover:text-white w-full px-4 py-2 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                        <span className="font-bold text-lg">Faculty Panel</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500">
                        <LogOut className="h-6 w-6" />
                    </button>
                </header>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Permission Requests Overview</h1>
                    <p className="text-gray-600 mt-1">Review and manage student digital permission requests.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Student Info</th>
                                    <th className="px-6 py-4 font-semibold">Purpose</th>
                                    <th className="px-6 py-4 font-semibold">Date & Location</th>
                                    <th className="px-6 py-4 font-semibold text-center">Attachment</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {permissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No permission requests found.</td>
                                    </tr>
                                ) : (
                                    permissions.map((p: any) => (
                                        <tr key={p._id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{p.name}</div>
                                                <div className="text-gray-500">{p.rollNumber}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{p.studentEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate" title={p.purpose}>{p.purpose}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 font-medium whitespace-nowrap">{new Date(p.time).toLocaleString()}</div>
                                                {p.location && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${p.location.lat},${p.location.lng}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1"
                                                    >
                                                        <Map className="h-3 w-3" />
                                                        View on Map
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {p.fileUrl ? (
                                                    <a href={p.fileUrl} download={`Permit_${p.rollNumber}`} className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download Document">
                                                        <FileDown className="h-5 w-5" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">None</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${p.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-amber-100 text-amber-800'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                {p.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(p._id, 'Approved')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <CheckCircle className="h-4 w-4" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(p._id, 'Rejected')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

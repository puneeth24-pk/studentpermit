'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, LogIn, FileText } from 'lucide-react';

export default function FacultyLogin() {
    const router = useRouter();
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/faculty/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ facultyId, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('faculty_token', data.token);
            router.push('/dashboard/faculty');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Branding only */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 flex-col items-center justify-center p-12 text-white">
                <FileText className="h-16 w-16 mb-6 opacity-90" />
                <h1 className="text-4xl font-bold mb-3">Faculty Portal</h1>
                <p className="text-indigo-200 text-lg text-center">Review and manage student permission requests</p>
                <p className="text-indigo-300 text-sm text-center mt-2">Madanapalle Institute of Technology and Sciences</p>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <FileText className="h-8 w-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">Faculty Portal</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Faculty Login</h2>
                        <p className="text-gray-500 text-sm mb-6">Sign in with your faculty credentials</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠ {error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty ID</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text" required value={facultyId} onChange={e => setFacultyId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter faculty ID"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                            >
                                {loading ? 'Signing in...' : <><LogIn className="h-4 w-4" /> Sign In</>}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Student? <Link href="/login/student" className="text-blue-600 font-semibold hover:underline">Student Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

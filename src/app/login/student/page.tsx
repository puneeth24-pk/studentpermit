'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, FileText } from 'lucide-react';

export default function StudentLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('student_token', data.token);
            router.push('/dashboard/student');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 flex-col items-center justify-center p-12 text-white">
                <FileText className="h-16 w-16 mb-6 opacity-90" />
                <h1 className="text-4xl font-bold mb-3">Student Permit</h1>
                <p className="text-blue-200 text-lg text-center leading-relaxed">Smart Digital Permissions Management System</p>
                <p className="text-blue-300 text-sm text-center mt-2">Madanapalle Institute of Technology and Sciences</p>
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
                    {['Easy Submission', 'GPS Location', 'File Upload', 'Quick Approval'].map(f => (
                        <div key={f} className="bg-white/10 rounded-xl p-3 text-center text-xs font-medium text-blue-100">{f}</div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">Student Permit</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Student Login</h2>
                        <p className="text-gray-500 text-sm mb-6">Sign in with your MITS college email</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠ {error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter student email"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                            >
                                {loading ? 'Signing in...' : <><LogIn className="h-4 w-4" /> Sign In</>}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            No account? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
                        </p>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            Faculty? <Link href="/login/faculty" className="text-indigo-600 font-semibold hover:underline">Faculty Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

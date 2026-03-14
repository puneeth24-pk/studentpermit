'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, UserPlus, FileText, CheckCircle } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            localStorage.setItem('student_token', data.token);
            setSuccess(true);
            setTimeout(() => router.push('/dashboard/student'), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                    <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-600 flex-col items-center justify-center p-12 text-white">
                <FileText className="h-16 w-16 mb-6 opacity-90" />
                <h1 className="text-4xl font-bold mb-3">Join Student Permit</h1>
                <p className="text-blue-100 text-lg text-center">Create your account with your MITS college email</p>
                <div className="mt-10 space-y-3 w-full max-w-xs">
                    {[
                        '✅ Submit digital permission requests',
                        '📎 Attach supporting documents',
                        '📍 Auto GPS & time capture',
                        '🔔 Real-time approval status',
                    ].map(f => (
                        <div key={f} className="bg-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100">{f}</div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">Student Permit</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Student Registration</h2>
                        <p className="text-gray-500 text-sm mb-6">Use your valid MITS college email ID</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠ {error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">College Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter student email"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Must end with @mits.ac.in</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                            >
                                {loading ? 'Creating Account...' : <><UserPlus className="h-4 w-4" /> Create Account</>}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already registered? <Link href="/login/student" className="text-blue-600 font-semibold hover:underline">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

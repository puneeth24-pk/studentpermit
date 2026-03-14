'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [fallbackOtp, setFallbackOtp] = useState('');

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/student/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setMessage(data.message);
            if (data.otp) setFallbackOtp(data.otp);
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/student/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to reset password');
            setDone(true);
            setTimeout(() => router.push('/login/student'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                    <p className="text-gray-500 text-sm">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
                            <KeyRound className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            {step === 1 ? 'Enter your MITS email to receive an OTP' : `OTP sent to ${email}`}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex border-b border-gray-100">
                        <div className={`flex-1 py-3 text-center text-xs font-semibold ${step === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>
                            1. Request OTP
                        </div>
                        <div className={`flex-1 py-3 text-center text-xs font-semibold ${step === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>
                            2. Reset Password
                        </div>
                    </div>

                    <div className="px-8 py-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
                                <span className="flex-shrink-0 mt-0.5">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {message && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
                                <span className="flex-shrink-0 mt-0.5">✅</span>
                                <span>{message}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleRequestOTP} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">MITS College Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter student email"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP to My Email'}
                                </button>
                                <div className="text-center">
                                    <Link href="/login/student" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                        <ArrowLeft className="h-4 w-4" /> Back to Login
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {fallbackOtp ? (
                                    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-center">
                                        <p className="text-amber-700 text-xs font-semibold uppercase mb-2">Security Verification Code</p>
                                        <p className="text-4xl font-black tracking-[0.4em] text-amber-800 bg-white py-3 rounded-lg border border-amber-200">{fallbackOtp}</p>
                                        <p className="text-amber-600 text-xs mt-2">Enter this code below to verify and reset your password</p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                                        📧 Check your Outlook inbox at <strong>{email}</strong> for the 6-digit OTP
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-3xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="______"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
                                >
                                    {loading ? 'Resetting...' : 'Reset My Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(''); setMessage(''); }}
                                    className="w-full text-sm text-blue-600 hover:underline"
                                >
                                    ← Resend OTP to a different email
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Student Permit – MITS CSE AI Dept</p>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { FileText, MapPin, Upload, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: <FileText className="h-7 w-7 text-rose-600" />,
            title: 'Easy Submission',
            desc: 'Submit digital permission requests instantly without paper trails.',
            bg: 'from-rose-50 to-pink-50 border-rose-100',
            iconBg: 'bg-rose-100',
        },
        {
            icon: <Upload className="h-7 w-7 text-blue-600" />,
            title: 'Upload Documents',
            desc: 'Attach supporting files – Images, PDFs, and Word documents.',
            bg: 'from-blue-50 to-indigo-50 border-blue-100',
            iconBg: 'bg-blue-100',
        },
        {
            icon: <MapPin className="h-7 w-7 text-pink-600" />,
            title: 'Auto GPS & Time',
            desc: 'Automatically captures your location and system time securely.',
            bg: 'from-pink-50 to-fuchsia-50 border-pink-100',
            iconBg: 'bg-pink-100',
        },
        {
            icon: <CheckCircle className="h-7 w-7 text-blue-700" />,
            title: 'Quick Approval',
            desc: 'Instant 1-click approval or rejection from faculty dashboard.',
            bg: 'from-indigo-50 to-blue-50 border-indigo-100',
            iconBg: 'bg-indigo-100',
        },
    ];

    const steps = [
        { n: '1', label: 'Student registers', color: 'bg-rose-100 text-rose-600' },
        { n: '2', label: 'Submits request', color: 'bg-pink-100 text-pink-600' },
        { n: '3', label: 'Faculty reviews', color: 'bg-blue-100 text-blue-700' },
        { n: '4', label: 'Approved / Rejected', color: 'bg-indigo-100 text-indigo-700' },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans">

            {/* Navbar */}
            <nav className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-1.5 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">Student Permit</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/login/student" className="hidden sm:block text-gray-600 hover:text-rose-600 font-medium text-sm transition-colors">
                                Student Login
                            </Link>
                            <Link href="/login/faculty" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-sm">
                                Faculty Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {/* HERO */}
                <section className="relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-800" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f9a8d4 0%, transparent 40%), radial-gradient(circle at 80% 20%, #93c5fd 0%, transparent 40%)' }}
                    />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                            <Shield className="h-3.5 w-3.5" />
                            Digital Permission System
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                            Manage Student<br />
                            <span className="text-pink-300">Permissions Digitally</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-rose-100 font-medium mb-3">
                            Smart Digital Permissions Management System
                        </p>
                        <p className="text-base text-rose-200/80 max-w-2xl mx-auto mb-12">
                            Madanapalle Institute of Technology and Sciences (Deemed to be University), Angallu
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login/student"
                                className="flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-rose-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                Student Portal <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link href="/login/faculty"
                                className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/25 transition-all">
                                Faculty Portal
                            </Link>
                        </div>

                        {/* Stats bar */}
                        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                            {[['Paperless', 'Process'], ['Real-time', 'Approval'], ['Secure', 'OTP Login']].map(([top, bot]) => (
                                <div key={top} className="bg-white/10 backdrop-blur rounded-xl py-3 px-2 border border-white/20">
                                    <p className="text-white font-bold text-sm">{top}</p>
                                    <p className="text-rose-200 text-xs">{bot}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Key Features</h2>
                            <p className="mt-4 text-lg text-gray-500">Designed for seamless permission processing</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map(f => (
                                <div key={f.title} className={`bg-gradient-to-br ${f.bg} p-7 rounded-2xl border hover:shadow-xl transition-all hover:-translate-y-1`}>
                                    <div className={`${f.iconBg} w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 bg-gradient-to-br from-slate-50 to-rose-50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How It Works</h2>
                            <p className="mt-4 text-gray-500">Simple, fast, and fully digital</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4">
                            {steps.map((s, i) => (
                                <div key={s.n} className="flex md:flex-col items-center gap-4 md:gap-0">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl mb-3 shadow-md ${s.color}`}>
                                            {s.n}
                                        </div>
                                        <p className="font-semibold text-gray-800 text-center text-sm max-w-[100px]">{s.label}</p>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="text-gray-300 text-2xl md:hidden">↓</div>
                                    )}
                                    {i < steps.length - 1 && (
                                        <div className="hidden md:block text-gray-300 text-2xl mx-2 mt-[-20px]">→</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to go digital?</h2>
                        <p className="text-rose-100 mb-8">Register with your MITS email and submit your first permission request today.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg">
                            Create Account <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left mb-8">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-1.5 rounded-lg">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-lg">Student Permit</span>
                            </div>
                            <p className="text-slate-400 text-sm">Smart Digital Permissions Management</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold text-slate-200 mb-3">Contact</h4>
                            <p className="text-slate-400 text-sm mb-1">📧 24691A31J0@mits.ac.in</p>
                            <p className="text-slate-400 text-sm">📞 +91 9391098736</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-slate-400 text-sm">Developed by</p>
                            <p className="text-white font-semibold">CSE AI Dept – MITS</p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} Student Permit – Madanapalle Institute of Technology and Sciences. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

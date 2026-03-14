'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, FileText, Upload, MapPin } from 'lucide-react';

export default function StudentDashboard() {
    const router = useRouter();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        purpose: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('student_token');
        if (!token) {
            router.push('/login/student');
            return;
        }

        fetchPermissions(token);

        // Get location — fallback to MITS Angallu campus coordinates
        const MITS_LAT = 13.8527;
        const MITS_LNG = 78.9162;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    setLocationError('GPS denied — using MITS campus location.');
                    setLocation({ lat: MITS_LAT, lng: MITS_LNG });
                },
                { timeout: 8000, enableHighAccuracy: true }
            );
        } else {
            setLocationError('GPS not supported — using MITS campus location.');
            setLocation({ lat: MITS_LAT, lng: MITS_LNG });
        }
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
                if (res.status === 401) router.push('/login/student');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) {
            setError('Location is required. Please allow location access.');
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            let fileUrl = '';
            if (file) {
                // Fallback: Store as Base64. If given more time, upload to Cloudinary logic here.
                fileUrl = await toBase64(file);
            }

            const token = localStorage.getItem('student_token');
            const res = await fetch('/api/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    fileUrl,
                    location,
                    time: new Date().toISOString()
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit request');

            setMessage('Permission request submitted successfully!');
            setFormData({ name: '', rollNumber: '', purpose: '' });
            setFile(null);
            fetchPermissions(token!);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('student_token');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg tracking-tight">Student Portal</span>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center gap-3 bg-blue-600/20 text-blue-400 px-4 py-3 rounded-lg font-medium transition-colors">
                                <FileText className="h-5 w-5" />
                                Requests
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">Student Portal</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500">
                        <LogOut className="h-6 w-6" />
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">New Request</h2>

                            {message && <div className="mb-4 text-green-600 text-sm bg-green-50 p-3 rounded">{message}</div>}
                            {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
                            {locationError && <div className="mb-4 text-amber-600 text-sm bg-amber-50 p-3 rounded">{locationError}</div>}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:ring-primary focus:border-primary" placeholder="Enter name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                    <input type="text" required value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:ring-primary focus:border-primary" placeholder="Enter roll number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                    <textarea required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:ring-primary focus:border-primary" rows={3} placeholder="Reason for permission"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Document (Optional)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload a file</span>
                                                    <input type="file" className="sr-only" onChange={e => setFile(e.target.files?.[0] || null)} accept="image/*,.pdf,.doc,.docx" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, PDF up to 3MB'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">Auto Location Detected</p>
                                        {location ? (
                                            <p>{location.lat === 13.8527 ? 'MITS Campus (Fixed)' : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}</p>
                                        ) : (
                                            <p className="text-amber-500">Waiting for GPS...</p>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {submitting ? 'Submitting...' : 'Submit Permission'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Your Requests</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Date & Time</th>
                                            <th className="px-6 py-3">Purpose</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No requests submitted yet.</td>
                                            </tr>
                                        ) : (
                                            permissions.map((p: any) => (
                                                <tr key={p._id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        {new Date(p.time).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">{p.purpose}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                              ${p.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                                p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

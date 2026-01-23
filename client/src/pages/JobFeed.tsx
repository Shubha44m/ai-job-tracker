import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import ResumeUpload from '../components/ResumeUpload';
import { useJobStore } from '../store/jobStore';

const JobFeed = () => {
    const { jobs, loading, fetchJobs, matchResume, addApplication } = useJobStore();
    const [showApplyPopup, setShowApplyPopup] = useState<string | null>(null); // Stores Job ID
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (jobs.length === 0) fetchJobs();
    }, []);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            fetchJobs(searchTerm);
        }
    };

    const handleResumeUpload = (text: string) => {
        matchResume(text);
    };

    const handleApply = (id: string) => {
        const job = jobs.find(j => j.id === id);
        if (job) {
            window.open(`https://example.com/apply/${id}`, '_blank');
            setTimeout(() => setShowApplyPopup(id), 1000);
        }
    };

    const handleConfirmApply = (status: 'Applied' | 'Rejected' | 'Interview') => {
        if (!showApplyPopup) return;

        const job = jobs.find(j => j.id === showApplyPopup);
        if (job) {
            addApplication({
                jobId: job.id,
                jobTitle: job.title,
                company: job.company,
                status: status
            });
        }
        setShowApplyPopup(null);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-6 relative">

                {/* Apply Confirmation Popup */}
                {showApplyPopup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full animate-bounce-in">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Did you apply?</h3>
                            <p className="text-slate-500 mb-6">Help us track your progress. Did you complete the application for this role?</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleConfirmApply('Applied')}
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>✅</span> Yes, I applied
                                </button>
                                <button
                                    onClick={() => setShowApplyPopup(null)}
                                    className="w-full py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    No, just browsing
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Find your next role</h2>
                        <p className="text-slate-500 mt-1">
                            {loading ? "Searching..." : `We've found ${jobs.length} jobs matching your profile.`}
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by role or skill (Press Enter)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full md:w-80 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="hidden lg:block space-y-6">
                        <ResumeUpload onUploadSuccess={(text: string) => handleResumeUpload(text)} />

                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4">Filters</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" className="rounded text-blue-600" /> Remote
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" className="rounded text-blue-600" /> Full-time
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Job List */}
                    <div className="lg:col-span-3 space-y-6">
                        {loading && jobs.length === 0 ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Best Matches Section */}
                                {jobs.some(j => j.match && j.match.score >= 80) && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">✨</span>
                                            <h3 className="text-xl font-bold text-slate-900">Anti-Gravity's Best Matches</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {jobs.filter(j => j.match && j.match.score >= 80).slice(0, 6).map(job => (
                                                <JobCard key={`best-${job.id}`} job={job} onApply={handleApply} />
                                            ))}
                                        </div>
                                        <div className="border-b border-slate-200 my-8" />
                                        <h3 className="text-xl font-bold text-slate-900">All Relevant Roles</h3>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {jobs.filter(j => !(j.match && j.match.score >= 80)).map(job => (
                                        <JobCard key={job.id} job={job} onApply={handleApply} />
                                    ))}
                                    {jobs.length === 0 && !loading && (
                                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                            <p className="text-slate-400">No jobs found matching your filters.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JobFeed;

import React from 'react';
import { MapPin, Briefcase, Clock, CheckCircle } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    skills: string[];
    postedAt: string;
    match?: {
        score: number;
        match_level: 'High' | 'Medium' | 'Low';
        reasons: string[];
    };
}

interface JobCardProps {
    job: Job;
    onApply: (id: string) => void;
}

const JobCard = ({ job, onApply }: JobCardProps) => {
    const getMatchColor = (score = 0) => {
        if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-slate-500 bg-slate-50 border-slate-200';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden group">
            {/* Match Score Badge */}
            {job.match && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getMatchColor(job.match.score)}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {job.match.match_level} Match ({job.match.score}%)
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-slate-500 font-medium">{job.company}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5 text-xs">
                    <MapPin size={14} /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                    <Briefcase size={14} /> {job.type}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                    <Clock size={14} /> {new Date(job.postedAt).toLocaleDateString()}
                </div>
            </div>

            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {job.description}
            </p>

            {job.match?.reasons && job.match.reasons.length > 0 && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Why you match</p>
                    <ul className="space-y-1">
                        {job.match.reasons.map((reason, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                    {job.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                            +{job.skills.length - 3}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => onApply(job.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobCard;

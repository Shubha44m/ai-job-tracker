import React, { useState } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';

interface ResumeUploadProps {
    onUploadSuccess: () => void;
}

const ResumeUpload = ({ onUploadSuccess }: ResumeUploadProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        // Simulate upload delay
        await new Promise(r => setTimeout(r, 1500));

        // In real app: await api.uploadResume(file);

        setUploading(false);
        onUploadSuccess();
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Resume Scan</h2>
            <p className="text-sm text-slate-500 mb-4">Upload your resume to unlock AI match scores.</p>

            {!file ? (
                <div
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                >
                    <input
                        id="resume-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleChange}
                    />
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Upload />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click or drag resume here</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT (Max 5MB)</p>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-blue-600">
                                <FileText />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
                            <X />
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {uploading ? 'Analyzing...' : 'Scan Resume'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;

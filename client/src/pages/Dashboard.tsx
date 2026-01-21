import Layout from '../components/Layout';
import { CheckCircle, Clock } from 'lucide-react';
import { useJobStore } from '../store/jobStore';

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Applied': 'bg-blue-100 text-blue-700',
        'Interview': 'bg-yellow-100 text-yellow-700',
        'Offer': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles['Applied']}`}>
            {status}
        </span>
    );
};

const Dashboard = () => {
    const { applications, updateApplicationStatus } = useJobStore();

    const stats = [
        { label: 'Total Applications', value: applications.length, icon: <Clock />, color: 'bg-blue-500' },
        { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, icon: <CheckCircle />, color: 'bg-yellow-500' },
        { label: 'Offers', value: applications.filter(a => a.status === 'Offer').length, icon: <CheckCircle />, color: 'bg-green-500' },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Application Tracker</h2>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-lg ${stat.color} text-white flex items-center justify-center opacity-80`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-bold text-slate-900">Recent Applications</h3>
                    </div>
                    <div className="overflow-x-auto">
                        {applications.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Job Title</th>
                                        <th className="px-6 py-4">Company</th>
                                        <th className="px-6 py-4">Date Applied</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 font-medium">{app.jobTitle}</td>
                                            <td className="px-6 py-4 text-slate-600">{app.company}</td>
                                            <td className="px-6 py-4 text-slate-600">{app.date}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={app.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    className="text-xs border border-slate-200 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    value={app.status}
                                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                                                >
                                                    <option value="Applied">Applied</option>
                                                    <option value="Interview">Interview</option>
                                                    <option value="Offer">Offer</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                No applications tracked yet. Start applying to see your progress here!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

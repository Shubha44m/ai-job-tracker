import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout = ({ children }: { children: ReactNode }) => {
    const { pathname } = useLocation();
    const { user } = useAuthStore();

    const navItems = [
        { icon: <Briefcase />, label: 'Job Feed', path: '/' },
        { icon: <LayoutDashboard />, label: 'Applications', path: '/dashboard' },
        { icon: <MessageSquare />, label: 'AI Assistant', path: '/chat' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        JobAI
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Smart Application Tracker</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === item.path
                                ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className={`${pathname === item.path ? 'bg-white p-1.5 rounded-lg shadow-sm' : ''}`}>
                                {item.icon}
                            </div>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user?.name?.charAt(0).toUpperCase() || <User />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Guest User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'Demo Account'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {/* Glassmorphism Background Elements */}
                    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                        <div className="absolute top-[-10%] right-[-5%] w-[5000px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px]" />
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;

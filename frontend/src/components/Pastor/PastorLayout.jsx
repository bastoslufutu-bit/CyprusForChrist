import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    MessageSquare,
    BookOpen,
    Heart,
    FileText,
    Clock,
    Calendar,
    LayoutDashboard
} from 'lucide-react';
import ProtectedLayout from '../Auth/ProtectedLayout';

const PastorLayout = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/pastor', icon: LayoutDashboard, exact: true },
        { name: 'Prières', path: '/pastor/prayers', icon: MessageSquare },
        { name: 'Sermons', path: '/pastor/sermons', icon: BookOpen },
        { name: 'Donations', path: '/pastor/donations', icon: Heart },
        { name: 'Rhema', path: '/pastor/rhema', icon: FileText },
        { name: 'Disponibilités', path: '/pastor/availabilities', icon: Clock },
        { name: 'Rendez-vous', path: '/pastor/appointments', icon: Calendar },
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    const sidebar = (
        <nav className="p-4 space-y-2">
            <div className="mb-6 px-3">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Dashboard Pasteur</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gestion de la communauté</p>
            </div>
            {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <ProtectedLayout sidebar={sidebar} userRole="PASTOR">
            <Outlet />
        </ProtectedLayout>
    );
};

export default PastorLayout;

import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Heart,
    MessageSquare,
    Calendar
} from 'lucide-react';
import ProtectedLayout from '../Auth/ProtectedLayout';

const MemberLayout = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Mon Dashboard', path: '/member', icon: LayoutDashboard, exact: true },
        { name: 'Mon Profil', path: '/member/profile', icon: User },
        { name: 'Mes Prières', path: '/member/prayers', icon: MessageSquare },
        { name: 'Mes Dons', path: '/member/donations', icon: Heart },
        { name: 'Rendez-vous', path: '/member/appointments', icon: Calendar },
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
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Espace Membre</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mon compte personnel</p>
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
        <ProtectedLayout sidebar={sidebar} userRole="MEMBER">
            <Outlet />
        </ProtectedLayout>
    );
};

export default MemberLayout;

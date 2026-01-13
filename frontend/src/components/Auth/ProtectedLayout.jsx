import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

/**
 * Base Protected Layout Component
 * Fournit une interface épurée avec header minimaliste et sidebar (optionnelle)
 * pour les utilisateurs connectés (Member, Pastor, Admin)
 */
const ProtectedLayout = ({ children, sidebar, userRole = 'USER', bgColor = 'bg-gray-50' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={`min-h-screen ${bgColor} dark:bg-slate-900 transition-colors duration-300`}>
            {/* Header Épuré */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-bordeaux dark:text-gold">
                                Cyprus For Christ
                            </h1>
                        </div>

                        {/* Actions Grouped on the Right */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Bouton Home - Visible sur sm, icône seule sur mobile */}
                            <Link
                                to="/"
                                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-bold group"
                                title="Retour au site"
                            >
                                <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                <span className="hidden md:inline">Voir le site</span>
                            </Link>

                            {/* User Info */}
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-700/50 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-600">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    {user?.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt={user.first_name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-4 h-4" />
                                    )}
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 hidden lg:block">
                                    {user?.first_name || user?.username}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-bold group"
                                title="Se déconnecter"
                            >
                                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                <span className="hidden md:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content avec ou sans Sidebar */}
            <div className="flex">
                {/* Sidebar (si fournie) */}
                {sidebar && (
                    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 min-h-[calc(100vh-4rem)] sticky top-16">
                        {sidebar}
                    </aside>
                )}

                {/* Content Area */}
                <main className="flex-1 p-6">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;

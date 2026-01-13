import React, { useState, useEffect } from 'react';
import {
    Heart,
    MessageSquare,
    Calendar,
    ArrowRight,
    TrendingUp,
    Star,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MemberDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        donations: 0,
        prayers: 0,
        appointments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [donationsRes, prayersRes, appointmentsRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/donations/', { headers }),
                fetch('http://127.0.0.1:8000/api/prayers/', { headers }),
                fetch('http://127.0.0.1:8000/api/appointments/', { headers })
            ]);

            const getCount = async (res) => {
                if (!res.ok) return 0;
                const data = await res.json();
                const results = Array.isArray(data) ? data : (data.results || []);
                return results.length;
            };

            const getDonationTotal = async (res) => {
                if (!res.ok) return 0;
                const data = await res.json();
                const results = Array.isArray(data) ? data : (data.results || []);
                return results
                    .filter(d => d.status === 'COMPLETED')
                    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
            };

            setStats({
                donations: await getDonationTotal(donationsRes),
                prayers: await getCount(prayersRes),
                appointments: await getCount(appointmentsRes)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bonjour, {user?.first_name || 'Membre'} !</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Heureux de vous revoir dans votre espace spirituel.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Donation Stat */}
                <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <p className="text-indigo-100 font-medium">Total des Dons</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.donations.toFixed(2)} €</h3>
                    </div>
                    <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                </div>

                {/* Prayers Stat */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl w-fit mb-4 text-amber-600 dark:text-amber-400">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Requêtes de Prière</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.prayers}</h3>
                </div>

                {/* Appointments Stat */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl w-fit mb-4 text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Rendez-vous</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.appointments}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Actions Rapides</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/member/donations" className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Faire un don</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/member/prayers" className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Demander la prière</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/member/appointments" className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Rendez-vous</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/member/profile" className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Mon profil</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Information Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 border border-indigo-100 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                            C
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Cyprus For Christ</h3>
                            <p className="text-sm text-gray-500">Bâtir une communauté de foi.</p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                        "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux." - Matthieu 18:20
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboardPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    MessageSquare,
    BookOpen,
    Heart,
    Calendar,
    FileText,
    Clock,
    TrendingUp,
    Users,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AppointmentTimer from '../../components/Pastor/AppointmentTimer';

const PastorDashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        prayersCount: 0,
        sermonsCount: 0,
        totalDonations: 0,
        pendingAppointments: 0,
        allAppointments: [],
        recentActivities: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

            const [prayersRes, sermonsRes, donationsRes, appointmentsRes] = await Promise.all([
                fetch(`${baseUrl}/prayers/`, { headers }),
                fetch(`${baseUrl}/sermons/`, { headers }),
                fetch(`${baseUrl}/donations/`, { headers }),
                fetch(`${baseUrl}/appointments/`, { headers })
            ]);

            const [pData, sData, dData, aData] = await Promise.all([
                prayersRes.json(),
                sermonsRes.json(),
                donationsRes.json(),
                appointmentsRes.json()
            ]);

            const pArr = pData.results || (Array.isArray(pData) ? pData : []);
            const sArr = sData.results || (Array.isArray(sData) ? sData : []);
            const dArr = dData.results || (Array.isArray(dData) ? dData : []);
            const aArr = aData.results || (Array.isArray(aData) ? aData : []);

            setStats({
                prayersCount: pArr.length,
                sermonsCount: sArr.length,
                totalDonations: dArr.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0),
                pendingAppointments: aArr.filter(a => a.status === 'PENDING').length,
                allAppointments: aArr,
                recentActivities: [
                    ...pArr.slice(0, 3).map(p => ({ type: 'prayer', data: p })),
                    ...aArr.slice(0, 3).map(a => ({ type: 'appointment', data: a }))
                ].slice(0, 5)
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

    const quickActions = [
        { name: 'Prières', path: '/pastor/prayers', icon: MessageSquare, color: 'bg-blue-500', count: stats.prayersCount },
        { name: 'Sermons', path: '/pastor/sermons', icon: BookOpen, color: 'bg-purple-500', count: stats.sermonsCount },
        { name: 'Donations', path: '/pastor/donations', icon: Heart, color: 'bg-rose-500', count: `${stats.totalDonations.toFixed(2)} €` },
        { name: 'Rendez-vous', path: '/pastor/appointments', icon: Calendar, color: 'bg-amber-500', count: stats.pendingAppointments + ' en attente' },
        { name: 'Rhema', path: '/pastor/rhema', icon: FileText, color: 'bg-green-500' },
        { name: 'Disponibilités', path: '/pastor/availability', icon: Clock, color: 'bg-cyan-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bienvenue, {user?.first_name || 'Pasteur'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Voici un aperçu de vos activités pastorales
                </p>
            </div>

            {/* Appointment Countdown Timer */}
            <AppointmentTimer appointments={stats.allAppointments} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Prières reçues"
                    value={stats.prayersCount}
                    icon={MessageSquare}
                    color="bg-blue-500"
                    trend="+12% ce mois"
                />
                <StatCard
                    title="Sermons publiés"
                    value={stats.sermonsCount}
                    icon={BookOpen}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Donations totales"
                    value={`${stats.totalDonations.toFixed(2)} €`}
                    icon={Heart}
                    color="bg-rose-500"
                    trend="+8% ce mois"
                />
                <StatCard
                    title="RDV en attente"
                    value={stats.pendingAppointments}
                    icon={Calendar}
                    color="bg-amber-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accès rapide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${action.color} bg-opacity-10`}>
                                        <action.icon className={`w-6 h-6 ${action.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{action.name}</h3>
                                        {action.count && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.count}</p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activité récente</h2>
                <div className="space-y-4">
                    {stats.recentActivities.length > 0 ? (
                        stats.recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                {activity.type === 'prayer' ? (
                                    <>
                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Nouvelle prière: {activity.data.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                De: {activity.data.is_anonymous ? 'Anonyme' : activity.data.full_name}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Nouveau rendez-vous demandé
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {activity.data.requested_date} à {activity.data.requested_time}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucune activité récente</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h4>
    </motion.div>
);

export default PastorDashboardPage;

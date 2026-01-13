import React, { useState, useEffect } from 'react';
import {
    Heart,
    Search,
    Filter,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    Loader
} from 'lucide-react';
import { motion } from 'framer-motion';

const PastorDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/donations/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setDonations(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalDonations = donations
        .filter(d => d.status === 'COMPLETED')
        .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const filteredDonations = donations.filter(donation => {
        const matchesSearch = (donation.member_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (donation.amount?.toString() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historique des Dons</h1>
                    <p className="text-gray-500 dark:text-gray-400">Suivi des contributions financières</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm dark:text-white"
                        >
                            <option value="ALL">Tout</option>
                            <option value="COMPLETED">Confirmé</option>
                            <option value="PENDING">En attente</option>
                        </select>
                        <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-indigo-100">Collecte Totale</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold">{totalDonations.toFixed(2)} €</span>
                        <span className="text-indigo-200">confirmés</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Heart className="w-48 h-48" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Donateur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Montant</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                            {filteredDonations.length > 0 ? (
                                filteredDonations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <Heart className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {donation.is_anonymous ? 'Anonyme' : (donation.member_name || 'Inconnu')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-3 h-3 mr-2" />
                                                {new Date(donation.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900 dark:text-white">{donation.amount} {donation.currency}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${donation.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {donation.status === 'COMPLETED' ? 'Confirmé' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                        <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        Aucun don trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PastorDonations;

import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Filter,
    CheckCircle,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

const PastorPrayers = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchPrayers();
    }, []);

    const fetchPrayers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/prayers/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setPrayers(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/prayers/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchPrayers();
            }
        } catch (error) {
            console.error('Error updating prayer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette demande de prière ?')) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/prayers/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchPrayers();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting prayer:', error);
        }
    };

    const filteredPrayers = prayers.filter(prayer => {
        const matchesSearch = (prayer.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (prayer.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (prayer.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || prayer.status === statusFilter;
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prières Reçues</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gérez les demandes de prière de la communauté</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                        >
                            <option value="ALL">Tout</option>
                            <option value="PENDING">En attente</option>
                            <option value="RESOLVED">Traité</option>
                        </select>
                        <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {filteredPrayers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredPrayers.map((prayer) => (
                        <motion.div
                            key={prayer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{prayer.title}</h4>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                                        De: {prayer.is_anonymous ? 'Anonyme' : (prayer.full_name || 'Inconnu')}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${prayer.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                    prayer.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {prayer.status === 'PENDING' ? 'En attente' : 'Traité'}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{prayer.content}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-slate-700">
                                <span className="text-xs text-gray-400">
                                    {new Date(prayer.created_at).toLocaleString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDelete(prayer.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    {prayer.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(prayer.id, 'RESOLVED')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all flex items-center space-x-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Marquer comme traité</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                    <MessageSquare className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Aucune requête de prière trouvée.</p>
                </div>
            )}
        </div>
    );
};

export default PastorPrayers;

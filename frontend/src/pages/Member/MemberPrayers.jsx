import React, { useState, useEffect } from 'react';
import { Star, Plus, Search, Filter, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/client';

const MemberPrayers = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchPrayers();
    }, []);

    const fetchPrayers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('prayers/');
            const data = response.data;
            setPrayers(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            core / management / base.py
            console.error('Error fetching prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('prayers/', formData);
            if (response.status === 201 || response.status === 200) {
                setShowModal(false);
                setFormData({ title: '', content: '' });
                fetchPrayers();
            }
        } catch (error) {
            console.error('Error sending prayer:', error);
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Requêtes de Prière</h1>
                    <p className="text-gray-500 dark:text-gray-400">Suivez vos demandes et témoignages</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nouvelle Requête</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prayers.length > 0 ? (
                    prayers.map((prayer) => (
                        <motion.div
                            key={prayer.id}
                            layout
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                                    <Star className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${prayer.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                    prayer.status === 'PRAYED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {prayer.status === 'PENDING' ? 'En attente' : prayer.status === 'PRAYED' ? 'En prière' : 'Exaucé'}
                                </span>
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{prayer.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-4 leading-relaxed">
                                {prayer.content}
                            </p>
                            <div className="pt-4 border-t border-gray-50 dark:border-slate-700 text-xs text-gray-400">
                                Envoyée le: <span className="font-bold">{new Date(prayer.created_at).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                        <Star className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Aucune requête de prière envoyée.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Demander la Prière</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Sujet</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none dark:text-white"
                                        placeholder="ex: Santé, Famille, Travail..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Contenu</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none dark:text-white resize-none"
                                        placeholder="Décrivez votre besoin de prière..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Envoyer</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberPrayers;

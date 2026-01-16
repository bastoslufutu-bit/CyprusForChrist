import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter, Calendar, TrendingUp, ChevronRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/client';

const MemberDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('20');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('donations/');
            const data = response.data;
            setDonations(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('donations/create/', {
                amount,
                currency: 'EUR',
                is_anonymous: false
            });
            const data = response.data;
            if (data.approval_url) {
                window.location.href = data.approval_url;
            }
        } catch (error) {
            console.error('Error donating:', error);
        }
    };

    const totalDonated = donations
        .filter(d => d.status === 'COMPLETED')
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Dons</h1>
                    <p className="text-gray-500 dark:text-gray-400">Soutenez l'œuvre du Seigneur</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto"
                >
                    <Heart className="w-4 h-4" />
                    <span>Faire un don</span>
                </button>
            </div>

            {/* Stats */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="w-6 h-6 p-1 bg-white/20 rounded-lg" />
                        <span className="font-semibold text-indigo-100 uppercase tracking-widest text-xs">Total des contributions</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold">{totalDonated.toFixed(2)} €</span>
                    </div>
                </div>
                <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 opacity-20 rotate-12" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Historique</h3>
                {donations.length > 0 ? (
                    <div className="space-y-4">
                        {donations.map((donation) => (
                            <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-sm transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{donation.amount} {donation.currency}</p>
                                        <p className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${donation.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {donation.status === 'COMPLETED' ? 'Confirmé' : 'En attente'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas encore fait de don.</p>
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Faire un don</h3>
                            <form onSubmit={handleDonate} className="space-y-6">
                                <div className="grid grid-cols-3 gap-2">
                                    {['10', '20', '50', '100', '200', '500'].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmount(amt)}
                                            className={`py-2 rounded-xl text-sm font-bold transition-all ${amount === amt
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
                                        >
                                            {amt}€
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest text-center">Montant Libre</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl font-bold dark:text-white"
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                    Continuer avec PayPal
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <p className="text-[10px] text-center text-gray-400">Transaction sécurisée SSL</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberDonations;

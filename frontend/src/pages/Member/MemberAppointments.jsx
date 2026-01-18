import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Search, MapPin, MessageSquare, Loader, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/client';

const MemberAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [pastors, setPastors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ pastor_id: '', subject: '', requested_date: '', requested_time: '', notes: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [apptsRes, pastorsRes] = await Promise.all([
                apiClient.get('appointments/'),
                apiClient.get('auth/pastors/')
            ]);

            console.log('DEBUG [Appointments]:', apptsRes.data);
            console.log('DEBUG [Pastors]:', pastorsRes.data);

            const processRes = (res) => {
                const data = res.data;
                // Logique plus robuste pour extraire la liste
                if (Array.isArray(data)) return data;
                if (data && data.results && Array.isArray(data.results)) return data.results;
                return [];
            };

            setAppointments(processRes(apptsRes));
            setPastors(processRes(pastorsRes));
        } catch (error) {
            console.error('Error fetching appointments info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('appointments/', {
                pastor: formData.pastor_id,
                subject: formData.subject,
                requested_date: formData.requested_date,
                requested_time: formData.requested_time,
                notes: formData.notes
            });
            if (response.status === 201 || response.status === 200) {
                setShowModal(false);
                setFormData({ pastor_id: '', subject: '', requested_date: '', requested_time: '', notes: '' });
                fetchData();
            }
        } catch (error) {
            console.error('Error booking:', error);
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Rendez-vous</h1>
                    <p className="text-gray-500 dark:text-gray-400">Consultez vos entretiens spirituels</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Rendez-vous</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <motion.div
                                key={appt.id}
                                layout
                                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="flex items-center space-x-5">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{appt.subject}</h4>
                                            <p className="text-sm font-bold text-indigo-600 mb-1">Pasteur: {appt.pastor_name}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {appt.requested_date}</span>
                                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {appt.requested_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {appt.status_display}
                                        </span>
                                    </div>
                                </div>

                                {appt.status === 'CONFIRMED' && (appt.location || appt.message_to_member) && (
                                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {appt.location && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Lieu</span>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{appt.location}</p>
                                                </div>
                                            </div>
                                        )}
                                        {appt.message_to_member && (
                                            <div className="flex items-start gap-3">
                                                <MessageSquare className="w-5 h-5 text-indigo-500 mt-0.5" />
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Consignes</span>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{appt.message_to_member}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                            <Calendar className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun rendez-vous planifié.</p>
                        </div>
                    )}
                </div>

                {/* Pastors Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Nos Pasteurs</h3>
                        <div className="space-y-6">
                            {pastors.length > 0 ? (
                                pastors.map(pastor => (
                                    <div key={pastor.id} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden flex-shrink-0">
                                            {pastor.profile_picture ? (
                                                <img src={pastor.profile_picture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-indigo-600">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{pastor.full_name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{pastor.bio || 'Consultation spirituelle'}</p>
                                        </div>
                                        <button
                                            onClick={() => { setFormData({ ...formData, pastor_id: pastor.id }); setShowModal(true); }}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Aucun pasteur disponible pour le moment.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Réserver un créneau</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Pasteur</label>
                                    <select
                                        required
                                        value={formData.pastor_id}
                                        onChange={(e) => setFormData({ ...formData, pastor_id: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                    >
                                        <option value="">
                                            {loading ? "Chargement des pasteurs..." :
                                                pastors.length > 0 ? "Sélectionner un pasteur" :
                                                    "Aucun pasteur disponible"}
                                        </option>
                                        {pastors.map(p => <option key={p.id} value={p.id}>{p.full_name || p.username}</option>)}
                                    </select>
                                    {pastors.length === 0 && !loading && (
                                        <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Aucun pasteur trouvé. Veuillez contacter l'administrateur.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Sujet</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        placeholder="ex: Conseil spirituel, Mariage..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.requested_date}
                                            onChange={(e) => setFormData({ ...formData, requested_date: e.target.value })}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Heure</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.requested_time}
                                            onChange={(e) => setFormData({ ...formData, requested_time: e.target.value })}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Notes (Optionnel)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                                        placeholder="Précisez votre demande..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Réserver</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberAppointments;

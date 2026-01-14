import React, { useState, useEffect } from 'react';
import {
    Clock,
    Plus,
    Edit,
    Trash2,
    Calendar,
    CheckCircle,
    Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AvailabilityFormModal = ({ availability, onSave, onClose }) => {
    const days = [
        { value: 'MONDAY', label: 'Lundi' },
        { value: 'TUESDAY', label: 'Mardi' },
        { value: 'WEDNESDAY', label: 'Mercredi' },
        { value: 'THURSDAY', label: 'Jeudi' },
        { value: 'FRIDAY', label: 'Vendredi' },
        { value: 'SATURDAY', label: 'Samedi' },
        { value: 'SUNDAY', label: 'Dimanche' }
    ];

    const [formData, setFormData] = useState({
        day_of_week: availability?.day_of_week || 'MONDAY',
        start_time: availability?.start_time || '09:00',
        end_time: availability?.end_time || '17:00',
        is_active: availability?.is_active ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gérer l'Horaire</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Jour de la semaine</label>
                        <select
                            value={formData.day_of_week}
                            onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none dark:text-white"
                        >
                            {days.map(day => <option key={day.value} value={day.value}>{day.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Heure début</label>
                            <input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Heure fin</label>
                            <input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none dark:text-white" required />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Actif / Ouvert</label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Enregistrer</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const PastorAvailability = () => {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAvail, setEditingAvail] = useState(null);

    useEffect(() => {
        fetchAvailabilities();
    }, []);

    const fetchAvailabilities = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/appointments/availabilities/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAvailabilities(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        const token = localStorage.getItem('access_token');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        const url = editingAvail
            ? `${baseUrl}/appointments/availabilities/${editingAvail.id}/`
            : `${baseUrl}/appointments/availabilities/`;

        try {
            const response = await fetch(url, {
                method: editingAvail ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingAvail(null);
                fetchAvailabilities();
            } else {
                const errorData = await response.json();
                alert(JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cet horaire ?')) return;
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/appointments/availabilities/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchAvailabilities();
            }
        } catch (error) {
            console.error('Error deleting availability:', error);
        }
    };

    const dayLabels = {
        'MONDAY': 'Lundi',
        'TUESDAY': 'Mardi',
        'WEDNESDAY': 'Mercredi',
        'THURSDAY': 'Jeudi',
        'FRIDAY': 'Vendredi',
        'SATURDAY': 'Samedi',
        'SUNDAY': 'Dimanche'
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
            <AnimatePresence>
                {showModal && (
                    <AvailabilityFormModal
                        availability={editingAvail}
                        onSave={handleSave}
                        onClose={() => { setShowModal(false); setEditingAvail(null); }}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Disponibilités</h1>
                    <p className="text-gray-500 dark:text-gray-400">Configurez vos horaires de rendez-vous</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un horaire</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availabilities.length > 0 ? (
                    availabilities.map(avail => (
                        <motion.div
                            key={avail.id}
                            layout
                            className={`p-6 rounded-3xl border transition-all ${avail.is_active
                                ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm'
                                : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-60'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => { setEditingAvail(avail); setShowModal(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(avail.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{dayLabels[avail.day_of_week]}</h4>
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-6">
                                <span>{avail.start_time.substring(0, 5)}</span>
                                <span className="mx-2">-</span>
                                <span>{avail.end_time.substring(0, 5)}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-slate-700">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${avail.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {avail.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                        <Calendar className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Aucune disponibilité configurée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastorAvailability;

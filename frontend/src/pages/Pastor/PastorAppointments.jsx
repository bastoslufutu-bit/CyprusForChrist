import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    MessageSquare,
    Trash2,
    Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppointmentTimer from '../../components/Pastor/AppointmentTimer';

const ConfirmAppointmentModal = ({ isOpen, onClose, onConfirm, appointment }) => {
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onConfirm(appointment.id, 'CONFIRMED', { location, message_to_member: message });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Confirmer le Rendez-vous</h3>
                <p className="text-gray-500 mb-6">Veuillez préciser le lieu et un message pour le membre.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Lieu du rendez-vous</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Bureau, Zoom, etc."
                                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Message (Optionnel)</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="3"
                            placeholder="Instructions pour le membre..."
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none dark:text-white resize-none"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 rounded-xl font-bold">Annuler</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                            {loading ? 'Traitement...' : 'Confirmer'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const PastorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/appointments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAppointments(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, status, extraData = {}) => {
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/appointments/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, ...extraData })
            });

            if (response.ok) {
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) return;
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/appointments/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchAppointments();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const filteredAppts = appointments.filter(appt => {
        const matchesSearch = (appt.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (appt.member_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;
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
            <AppointmentTimer appointments={appointments} />
            <ConfirmAppointmentModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleUpdate}
                appointment={selectedAppt}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rendez-vous</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gérez vos rendez-vous avec les membres</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Sujet, membre..."
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
                            <option value="PENDING">En attente</option>
                            <option value="CONFIRMED">Confirmé</option>
                            <option value="CANCELLED">Annulé</option>
                        </select>
                        <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredAppts.length > 0 ? (
                    filteredAppts.map(appt => (
                        <motion.div
                            key={appt.id}
                            layout
                            className={`p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all ${appt.status === 'PENDING' ? 'ring-2 ring-amber-500/20' : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{appt.subject}</h4>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {appt.status_display}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Membre: <span className="font-bold">{appt.member_name}</span>
                                    </p>
                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-500" /> {appt.requested_date}</span>
                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-500" /> {appt.requested_time}</span>
                                    </div>

                                    {(appt.location || appt.message_to_member) && (
                                        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {appt.location && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Lieu</span>
                                                        <p className="text-gray-900 dark:text-white font-medium">{appt.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {appt.message_to_member && (
                                                <div className="flex items-start gap-3">
                                                    <MessageSquare className="w-5 h-5 text-indigo-500 mt-0.5" />
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Consignes</span>
                                                        <p className="text-gray-600 dark:text-gray-400 italic">"{appt.message_to_member}"</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 justify-end items-start shrink-0">
                                    {appt.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => { setSelectedAppt(appt); setShowConfirmModal(true); }}
                                                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Confirmer
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(appt.id, 'CANCELLED')}
                                                className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Annuler
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(appt.id)}
                                        className="px-6 py-2 bg-gray-50 text-gray-600 border border-gray-100 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                        <Calendar className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Aucun rendez-vous trouvé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastorAppointments;

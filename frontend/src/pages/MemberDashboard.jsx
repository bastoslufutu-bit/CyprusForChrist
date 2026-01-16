import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/client';
import {
    User as UserIcon,
    Heart,
    Calendar,
    Star,
    Clock,
    Settings,
    LogOut,
    Camera,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    ChevronRight,
    Search,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MemberDashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const { t } = useLanguage();
    const fileInputRef = React.useRef(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [donations, setDonations] = useState([]);
    const [prayers, setPrayers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [pastors, setPastors] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [bookingData, setBookingData] = useState({ pastor: '', subject: '', requested_date: '', requested_time: '', notes: '' });
    const [prayerData, setPrayerData] = useState({ title: '', content: '' });
    const [donationAmount, setDonationAmount] = useState('10');

    useEffect(() => {
        fetchData();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('appointments/', bookingData);
            if (response.status === 201 || response.status === 200) {
                alert('Rendez-vous réservé avec succès !');
                setShowBookingModal(false);
                setBookingData({ pastor: '', subject: '', requested_date: '', requested_time: '', notes: '' });
                fetchData();
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    const handlePrayerRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('prayers/', prayerData);
            if (response.status === 201 || response.status === 200) {
                alert('Requête de prière envoyée !');
                setShowPrayerModal(false);
                setPrayerData({ title: '', content: '' });
                fetchData();
            }
        } catch (error) {
            console.error('Error sending prayer:', error);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('donations/create/', {
                amount: donationAmount,
                currency: 'EUR',
                is_anonymous: false
            });
            const data = response.data;
            if (data.approval_url) {
                window.location.href = data.approval_url;
            } else {
                alert(data.error || 'Erreur lors de la création du don');
            }
        } catch (error) {
            console.error('Error creating donation:', error);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profile_picture', file);

        try {
            const response = await apiClient.patch('auth/profile/', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                updateUser(response.data);
                alert('Photo de profil mise à jour !');
            } else {
                alert('Erreur lors de la mise à jour de la photo');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Une erreur est survenue lors de l\'envoi');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [donationsRes, prayersRes, appointmentsRes, pastorsRes, availabilitiesRes] = await Promise.all([
                apiClient.get('donations/'),
                apiClient.get('prayers/'),
                apiClient.get('appointments/'),
                apiClient.get('auth/pastors/'),
                apiClient.get('appointments/availabilities/')
            ]);

            const processData = (res) => {
                const data = res.data;
                return Array.isArray(data) ? data : (data.results || []);
            };

            setDonations(processData(donationsRes));
            setPrayers(processData(prayersRes));
            setAppointments(processData(appointmentsRes));
            setPastors(processData(pastorsRes));
            setAvailabilities(processData(availabilitiesRes));
        } catch (error) {
            console.error('Error fetching member data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Mon Profil', icon: UserIcon },
        { id: 'donations', label: 'Mes Contributions', icon: Heart },
        { id: 'prayers', label: 'Mes Prières', icon: Star },
        { id: 'appointments', label: 'Mes Rendez-vous', icon: Calendar },
    ];

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                                        {user?.profile_picture ? (
                                            <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                <UserIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                    />
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
                                    Membre
                                </div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Déconnexion</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informations Personnelles</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Prénom</label>
                                            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-900 dark:text-white border border-transparent">
                                                {user?.first_name || 'Non renseigné'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom</label>
                                            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-900 dark:text-white border border-transparent">
                                                {user?.last_name || 'Non renseigné'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-900 dark:text-white border border-transparent opacity-60">
                                                {user?.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Numéro de Membre</label>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-100 dark:border-indigo-800/30">
                                                {user?.member_id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Seul l'administrateur peut modifier vos informations d'identité. Pour tout changement, veuillez contacter le secrétariat.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'donations' && (
                                <motion.div
                                    key="donations"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/10">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-white/20 rounded-xl">
                                                    <Heart className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="font-medium opacity-90">Total des dons</span>
                                            </div>
                                            <div className="text-3xl font-bold">
                                                {donations.filter(d => d.status === 'COMPLETED').reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2)} €
                                            </div>
                                            <p className="text-xs mt-2 opacity-75">Cumulé sur toute la période</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Dernier don</p>
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {donations.length > 0 ? `${donations[0].amount} €` : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-500">Statut</p>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${donations.length > 0 && donations[0].status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {donations.length > 0 ? donations[0].status : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Historique des Contributions</h3>
                                            <button
                                                onClick={() => setShowDonationModal(true)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                                            >
                                                <Heart className="w-4 h-4" />
                                                Faire un don
                                            </button>
                                        </div>
                                        {donations.length > 0 ? (
                                            <div className="space-y-4">
                                                {donations.map((donation) => (
                                                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-300 transition-all group">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                                <Heart className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-white">{donation.amount} {donation.currency}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(donation.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {donation.status === 'COMPLETED' ? (
                                                                <span className="flex items-center space-x-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs font-medium">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    <span>Confirmé</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full text-xs font-medium">
                                                                    {donation.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Heart className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                                                <p className="text-gray-500 dark:text-gray-400">Aucune contribution pour le moment.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'prayers' && (
                                <motion.div
                                    key="prayers"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Requêtes de Prière</h3>
                                        <button
                                            onClick={() => setShowPrayerModal(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                                        >
                                            <Star className="w-4 h-4" />
                                            Nouvelle Requête
                                        </button>
                                    </div>
                                    {prayers.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {prayers.map((prayer) => (
                                                <div key={prayer.id} className="p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 relative group overflow-hidden hover:border-indigo-200 transition-all">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors rounded-bl-full flex items-start justify-end p-3">
                                                        <Star className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 pr-8">{prayer.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 min-h-[4.5rem]">{prayer.content}</p>
                                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                                                        <span className="text-xs text-indigo-500 font-medium">{new Date(prayer.created_at).toLocaleDateString()}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${prayer.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                                            prayer.status === 'PRAYED' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {prayer.status === 'PENDING' ? 'En attente' : prayer.status === 'PRAYED' ? 'En prière' : 'Exaucé'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Star className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">Vous n'avez envoyé aucune requête de prière.</p>
                                            <button
                                                onClick={() => setShowPrayerModal(true)}
                                                className="mt-4 text-indigo-600 font-bold hover:underline"
                                            >
                                                Envoyer ma première requête
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'appointments' && (
                                <motion.div
                                    key="appointments"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Availability Info */}
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl shadow-orange-200 dark:shadow-none">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold mb-2">Besoin d'un entretien ?</h3>
                                                <p className="opacity-90 max-w-lg text-sm">Consultez les disponibilités de nos pasteurs ci-dessous et réservez un créneau pour un entretien spirituel ou un conseil.</p>
                                            </div>
                                            <button
                                                onClick={() => setShowBookingModal(true)}
                                                className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all flex items-center gap-2"
                                            >
                                                <Calendar className="w-5 h-5" />
                                                Prendre rendez-vous
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* My Appointments List */}
                                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mes Rendez-vous</h3>
                                            {appointments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {appointments.map((appt) => (
                                                        <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                                                            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                                    <Clock className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 dark:text-white">{appt.subject}</p>
                                                                    <p className="text-xs text-indigo-600 font-bold mb-1">Pasteur: {appt.pastor_name}</p>
                                                                    <div className="flex items-center space-x-3 text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                                                        <span className="flex items-center">
                                                                            <Calendar className="w-3 h-3 mr-1" />
                                                                            {appt.requested_date}
                                                                        </span>
                                                                        <span className="flex items-center">
                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                            {appt.requested_time}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                                    appt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                        'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {appt.status_display}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Calendar className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                                                    <p className="text-gray-500 dark:text-gray-400">Aucun rendez-vous planifié.</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pastors List */}
                                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                                <User className="w-5 h-5 text-indigo-500" />
                                                Nos Pasteurs
                                            </h3>
                                            <div className="space-y-6">
                                                {pastors.map(pastor => (
                                                    <div key={pastor.id} className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-indigo-50">
                                                            {pastor.profile_picture ? (
                                                                <img src={pastor.profile_picture} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-indigo-500">
                                                                    <User className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 dark:text-white truncate">{pastor.full_name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{pastor.bio || 'Disponibilité affichée'}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setBookingData({ ...bookingData, pastor: pastor.id });
                                                                setShowBookingModal(true);
                                                            }}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Prayer Request Modal */}
            <AnimatePresence>
                {showPrayerModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPrayerModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Demander la Prière</h3>
                            <form onSubmit={handlePrayerRequest} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Titre de la requête</label>
                                    <input
                                        type="text"
                                        required
                                        value={prayerData.title}
                                        onChange={(e) => setPrayerData({ ...prayerData, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="ex: Santé de ma famille"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Détail de votre demande</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={prayerData.content}
                                        onChange={(e) => setPrayerData({ ...prayerData, content: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        placeholder="Décrivez votre besoin de prière..."
                                    ></textarea>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button type="button" onClick={() => setShowPrayerModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Envoyer</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nouveau Rendez-vous</h3>
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Choisir un Pasteur</label>
                                    <select
                                        required
                                        value={bookingData.pastor}
                                        onChange={(e) => setBookingData({ ...bookingData, pastor: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Sélectionner un pasteur</option>
                                        {pastors.map(p => (
                                            <option key={p.id} value={p.id}>{p.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Sujet</label>
                                    <input
                                        type="text"
                                        required
                                        value={bookingData.subject}
                                        onChange={(e) => setBookingData({ ...bookingData, subject: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="ex: Entretien spirituel"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={bookingData.requested_date}
                                            onChange={(e) => setBookingData({ ...bookingData, requested_date: e.target.value })}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Heure</label>
                                        <input
                                            type="time"
                                            required
                                            value={bookingData.requested_time}
                                            onChange={(e) => setBookingData({ ...bookingData, requested_time: e.target.value })}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Motif / Notes</label>
                                    <textarea
                                        rows="3"
                                        value={bookingData.notes}
                                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        placeholder="Optionnel..."
                                    ></textarea>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">Réserver</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Donation Modal */}
            <AnimatePresence>
                {showDonationModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDonationModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Faire un don</h3>
                                <p className="text-gray-500 text-sm mt-1">Soutenez l'œuvre du Seigneur</p>
                            </div>

                            <form onSubmit={handleDonate} className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {['10', '20', '50', '100', '200', '500'].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setDonationAmount(amt)}
                                            className={`py-2 rounded-xl text-sm font-bold transition-all ${donationAmount === amt
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
                                        >
                                            {amt}€
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Montant personnalisé (€)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-center text-xl font-bold"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button type="button" onClick={() => setShowDonationModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                                        Donner
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-4">Redirection sécurisée vers PayPal</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberDashboard;

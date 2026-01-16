import React, { useState } from 'react'
import apiClient from '../../api/client'
import { motion } from 'framer-motion'
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaChurch,
    FaEdit,
    FaSave,
    FaDonate,
    FaPray,
    FaVideo,
    FaHistory,
    FaSignOutAlt,
    FaUserCircle,
    FaShieldAlt,
    FaMapMarkerAlt,
    FaLock,
    FaQrcode,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        birth_date: user?.birth_date || '',
        bio: user?.bio || '',
        address: user?.address || 'Chypre'
    })

    // 2FA State
    const [show2FAModal, setShow2FAModal] = useState(false)
    const [qrCode, setQrCode] = useState(null)
    const [otp, setOtp] = useState('')

    const handleEnable2FA = async () => {
        try {
            const response = await apiClient.post('auth/2fa/enable/')
            if (response.status === 200) {
                setQrCode(response.data.qr_code)
                setShow2FAModal(true)
            } else {
                alert("Erreur lors de l'activation 2FA")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleVerify2FA = async () => {
        try {
            const response = await apiClient.post('auth/2fa/verify/', { otp })
            if (response.status === 200) {
                alert("2FA activé avec succès!")
                setShow2FAModal(false)
                window.location.reload()
            } else {
                alert("Code incorrect")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const stats = [
        { label: 'Sermons écoutés', value: '0', icon: FaVideo, color: 'from-blue-500 to-cyan-500' },
        { label: 'Dons totaux', value: '0 €', icon: FaDonate, color: 'from-gold to-lightGold' },
        { label: 'Prieres envoyées', value: '0', icon: FaPray, color: 'from-purple-500 to-pink-500' },
        { label: 'Événements', value: '0', icon: FaChurch, color: 'from-green-500 to-emerald-500' }
    ]

    const recentActivities = [
        { id: 1, action: 'Bienvenue', date: 'Aujourd\'hui', description: 'Heureux de vous compter parmi nous!' }
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleSave = async () => {
        try {
            const response = await apiClient.patch('auth/profile/', formData);

            if (response.status === 200) {
                setIsEditing(false);
                alert('Profil mis à jour avec succès !');
                window.location.reload(); // Quick way to refresh AuthContext data
            } else {
                throw new Error('Erreur lors de la mise à jour');
            }
        } catch (error) {
            alert(error.response?.data?.error || error.message);
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profile_picture', file);

        setIsUploading(true);
        try {
            const response = await apiClient.patch('auth/profile/', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert('Photo de profil mise à jour !');
                window.location.reload();
            } else {
                alert('Erreur lors du téléchargement');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${apiClient.defaults.baseURL.replace('/api/', '')}${cleanUrl}`;
}

const handleDownloadCard = () => {
    const content = `CARTE DE MEMBRE CFC\nID: ${user?.member_id}\nNOM: ${user?.first_name} ${user?.last_name}\nDATE: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CFC_Card_${user?.member_id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert("Votre carte temporaire a été téléchargée. La version Apple Wallet arrive très bientôt !");
}

const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
        ...prev,
        [name]: value
    }))
}

return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-8 rounded-3xl shadow-xl border border-gold/10">
                    <div className="flex items-center mb-6 md:mb-0">
                        <div className="relative group">
                            <label
                                htmlFor="profile-upload"
                                className="cursor-pointer block relative transition-transform hover:scale-105"
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-gold to-lightGold rounded-full flex items-center justify-center text-white overflow-hidden shadow-lg border-4 border-white">
                                    {user?.profile_picture ? (
                                        <img src={getImageUrl(user.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="text-5xl" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <FaEdit className="text-white text-xl" />
                                    </div>
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-bordeaux text-white p-1.5 rounded-full shadow-md z-10 border-2 border-white">
                                    <FaEdit className="h-3 w-3" />
                                </div>
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                        </div>
                        <div className="ml-6">
                            <h1 className="text-3xl font-playfair font-bold text-bordeaux">
                                {user?.first_name || user?.username} {user?.last_name}
                            </h1>
                            <p className="text-gray-500 font-medium">Membre depuis {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</p>
                            <div className="flex items-center mt-2 bg-gold/10 px-3 py-1 rounded-full w-fit">
                                <FaShieldAlt className="h-3 w-3 text-gold mr-2" />
                                <span className="text-[10px] uppercase font-bold text-gold tracking-widest">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border-2 border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center bg-gradient-to-r from-gold to-lightGold text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                                >
                                    <FaSave className="mr-2" />
                                    Enregistrer
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-6 py-2 border-2 border-gold text-gold rounded-xl font-bold hover:bg-gold hover:text-white transition-all text-sm"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-6 py-2 border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all text-sm"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Quitter
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-50 hover:border-gold/20 transition-all"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-inner mb-3`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="text-xl font-bold text-bordeaux">{stat.value}</div>
                                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">{stat.label}</div>
                                </div>
                            )
                        })}
                    </motion.div>

                    {/* Profile Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50"
                    >
                        <h2 className="text-2xl font-bold text-bordeaux mb-8 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mr-3">
                                <FaUser className="text-gold text-sm" />
                            </span>
                            Informations Personnelles
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Prénom
                                    </label>
                                    {isEditing ? (
                                        <input
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 font-medium">{formData.first_name || 'Non renseigné'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Nom
                                    </label>
                                    {isEditing ? (
                                        <input
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 font-medium">{formData.last_name || 'Non renseigné'}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    Email
                                </label>
                                <div className="px-5 py-4 bg-gray-100 rounded-2xl text-gray-500 font-medium">{formData.email}</div>
                                <p className="text-[10px] text-gray-400 mt-1 px-1 italic">Contactez l'admin pour changer d'email</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Téléphone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 font-medium">{formData.phone_number || 'Non renseigné'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Date de naissance
                                    </label>
                                    {isEditing ? (
                                        <input
                                            name="birth_date"
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 font-medium">
                                            {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString('fr-FR') : 'Non renseigné'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    Adresse locale (Chypre)
                                </label>
                                {isEditing ? (
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                    />
                                ) : (
                                    <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 font-medium flex items-center">
                                        <FaMapMarkerAlt className="text-gold mr-3 text-sm" />
                                        {formData.address}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    Bio / Témoignage court
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                    />
                                ) : (
                                    <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-600 italic leading-relaxed">
                                        "{formData.bio}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Donation History */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-bordeaux flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mr-3">
                                    <FaHistory className="text-gold text-sm" />
                                </span>
                                Historique des dons
                            </h2>
                            <button className="text-xs font-bold text-gold uppercase tracking-widest hover:text-bordeaux transition-all">
                                Voir tout
                            </button>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <table className="w-full min-w-[600px] text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="py-4 px-8 text-[10px] uppercase font-bold text-gray-400">Date</th>
                                        <th className="py-4 px-8 text-[10px] uppercase font-bold text-gray-400">Projet</th>
                                        <th className="py-4 px-8 text-[10px] uppercase font-bold text-gray-400">Montant</th>
                                        <th className="py-4 px-8 text-[10px] uppercase font-bold text-gray-400">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { date: '2024-01-15', project: 'Fonds Général', amount: '$50', status: 'Complété' },
                                        { date: '2023-12-15', project: 'Missions', amount: '$100', status: 'Complété' },
                                        { date: '2023-11-15', project: 'Jeunesse', amount: '$75', status: 'Complété' }
                                    ].map((donation, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="py-4 px-8 text-sm text-gray-600">
                                                {new Date(donation.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-4 px-8 text-sm font-bold text-gray-700">{donation.project}</td>
                                            <td className="py-4 px-8 text-sm font-bold text-gold">{donation.amount}</td>
                                            <td className="py-4 px-8">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    {donation.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                    {/* Recent Activities */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50"
                    >
                        <div className="bg-gradient-to-r from-bordeaux to-purple-800 p-8 text-white">
                            <h3 className="text-xl font-bold flex items-center">
                                <FaHistory className="mr-3 text-gold" />
                                Flux d'activités
                            </h3>
                        </div>

                        <div className="p-8 space-y-6">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="relative pl-6 border-l-2 border-gray-100 pb-1 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-gold"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-gray-800 leading-tight">{activity.action}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{activity.date}</span>
                                    </div>
                                    {activity.description && <p className="text-xs text-gray-500">{activity.description}</p>}
                                    {activity.title && <p className="text-xs text-gold font-medium italic">{activity.title}</p>}
                                    {activity.amount && <div className="text-xs font-bold text-gold mt-1">{activity.amount}</div>}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-royalBlue to-blue-700 rounded-3xl p-8 text-white shadow-xl"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                                <FaEdit className="text-white text-sm" />
                            </span>
                            Accès Rapides
                        </h3>

                        <div className="space-y-3">
                            <button onClick={() => navigate('/donations')} className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-sm">
                                <FaDonate className="mr-3 text-gold" />
                                Faire un don
                            </button>
                            <button onClick={() => navigate('/prayer-requests')} className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-sm">
                                <FaPray className="mr-3 text-gold" />
                                Demande de prière
                            </button>
                            <button onClick={() => navigate('/sermons')} className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-sm">
                                <FaVideo className="mr-3 text-gold" />
                                Médiathèque
                            </button>
                        </div>
                    </motion.div>

                    {/* Security Section (Sidebar) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-8 border border-gray-50 shadow-lg"
                    >
                        <h3 className="text-lg font-bold text-bordeaux mb-4 flex items-center">
                            <FaLock className="mr-3 text-gold" />
                            Sécurité
                        </h3>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${user?.is_2fa_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm font-bold text-gray-700">Double Authentification</span>
                            </div>
                            <span className="text-xs font-medium text-gray-400">
                                {user?.is_2fa_enabled ? 'Activé' : 'Désactivé'}
                            </span>
                        </div>

                        {!user?.is_2fa_enabled && (
                            <button
                                onClick={handleEnable2FA}
                                className="w-full flex items-center justify-center p-3 bg-bordeaux/5 text-bordeaux rounded-xl font-bold text-sm hover:bg-bordeaux hover:text-white transition-all"
                            >
                                <FaQrcode className="mr-2" />
                                Activer 2FA
                            </button>
                        )}
                    </motion.div>

                    {/* Membership Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 text-center border-2 border-dashed border-gold/30 shadow-inner"
                    >
                        <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaChurch className="h-8 w-8 text-gold" />
                        </div>
                        <h3 className="text-lg font-bold text-bordeaux mb-1">Carte de Membre</h3>
                        <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-widest">ID: {user?.member_id}</p>
                        <button
                            onClick={handleDownloadCard}
                            className="w-full bg-white text-gold border-2 border-gold/20 py-3 rounded-xl font-bold hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm"
                        >
                            Télécharger (Wallet)
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* 2FA Modal */}
        {show2FAModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                >
                    <button
                        onClick={() => setShow2FAModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>

                    <h3 className="text-2xl font-bold text-bordeaux mb-4 flex items-center">
                        <FaShieldAlt className="mr-3 text-gold" />
                        Configuration 2FA
                    </h3>

                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 mb-4">Scannez ce QR Code avec Google Authenticator</p>
                        {qrCode && (
                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gold/30 inline-block">
                                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="w-48 h-48" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                Code de vérification (6 chiffres)
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gold focus:outline-none text-center text-xl font-bold tracking-widest"
                                placeholder="000 000"
                            />
                        </div>

                        <button
                            onClick={handleVerify2FA}
                            className="w-full bg-gradient-to-r from-gold to-lightGold text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Vérifier et Activer
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </div>
)
}

export default Profile

import React, { useRef } from 'react';
import { Camera, AlertCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import apiClient from '../../api/client';

const MemberProfile = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await apiClient.patch('auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                updateUser(response.data);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mon Profil</h1>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-indigo-50 dark:border-indigo-900/20 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/40 transition-all">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                    <UserIcon className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all hover:scale-110"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                        />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prénom</label>
                                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-900 dark:text-white font-medium border border-transparent">
                                    {user?.first_name || 'Non renseigné'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom</label>
                                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-900 dark:text-white font-medium border border-transparent">
                                    {user?.last_name || 'Non renseigné'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-900 dark:text-white font-medium border border-transparent opacity-60">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identifiant Membre</label>
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-700 dark:text-indigo-300 font-mono font-bold border border-indigo-100 dark:border-indigo-800/30">
                                    {user?.member_id}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl flex items-start space-x-4">
                            <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                                <span className="font-bold underline block mb-1">Note Importante:</span>
                                Seul l'administrateur peut modifier vos informations d'identité. Pour tout changement (nom, prénom, email), veuillez contacter le secrétariat de l'église.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;

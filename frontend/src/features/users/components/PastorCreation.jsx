import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, User, Phone, Save, Copy, Check, AlertCircle } from 'lucide-react';
import { userService } from '../api';

const PastorCreation = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        // Basic validation
        if (!formData.username || !formData.email) {
            setError("Le nom d'utilisateur et l'email sont obligatoires");
            setLoading(false);
            return;
        }

        try {
            const data = await userService.createPastor(formData);
            setResult(data);
            setFormData({ username: '', email: '', first_name: '', last_name: '', phone_number: '' });
        } catch (err) {
            let msg = 'Erreur lors de la création du compte';
            const errorData = err.response?.data?.error;

            if (errorData) {
                if (typeof errorData === 'object') {
                    msg = errorData.message || JSON.stringify(errorData);
                    if (errorData.details) {
                        const firstKey = Object.keys(errorData.details)[0];
                        const firstVal = errorData.details[firstKey];
                        msg = `${firstKey}: ${Array.isArray(firstVal) ? firstVal[0] : firstVal}`;
                    }
                } else {
                    msg = errorData;
                }
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const text = `Identifiants Pasteur:\nUsername: ${result.username}\nEmail: ${result.email}\nMot de passe: ${result.generated_password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gold/10 dark:bg-gold/20 rounded-2xl text-gold">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un Compte Pasteur</h2>
                        <p className="text-gray-500 dark:text-gray-400">Seul l'administrateur peut créer des comptes pastoraux.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom d'utilisateur</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-gold transition-all text-gray-900 dark:text-white"
                                    placeholder="ex: pasteur_jean"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-gold transition-all text-gray-900 dark:text-white"
                                    placeholder="pasteur@exemple.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Prénom</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-gold transition-all text-gray-900 dark:text-white"
                                placeholder="Jean"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-gold transition-all text-gray-900 dark:text-white"
                                placeholder="Dupont"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-gold transition-all text-gray-900 dark:text-white"
                                    placeholder="+33..."
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl flex items-center space-x-3 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-gold to-lightGold text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Créer le Compte Pasteur</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Success Modal/Section */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-3xl p-8 space-y-6"
                >
                    <div className="flex items-center space-x-3 text-green-700 dark:text-green-300">
                        <Check className="w-8 h-8 bg-green-200 dark:bg-green-800/50 rounded-full p-1.5" />
                        <h3 className="text-xl font-bold">Compte créé avec succès !</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Veuillez communiquer ces identifiants au pasteur. Le mot de passe ne sera plus affiché après le rechargement de la page.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoField label="Identifiant" value={result.username} />
                            <InfoField label="Mot de Passe" value={result.generated_password} isSecret />
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-gold text-gold font-bold rounded-xl hover:bg-gold/5 transition-all"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            <span>{copied ? 'Copié !' : 'Copier les identifiants'}</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const InfoField = ({ label, value, isSecret }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{label}</label>
        <div className={`p-3 rounded-xl font-mono text-sm ${isSecret ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white'}`}>
            {value}
        </div>
    </div>
);

export default PastorCreation;

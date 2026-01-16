import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await apiClient.post('auth/password-reset/', { email });
            setMessage(String(response.data.message || "Email envoyé !"));
        } catch (err) {
            let errorMsg = "Une erreur s'est produite lors de l'envoi de l'email.";

            if (err.response) {
                // Le serveur a répondu avec un code d'erreur (4xx, 5xx)
                const errorData = err.response.data;
                if (errorData?.error?.message) {
                    errorMsg = errorData.error.message;
                } else if (errorData?.message) {
                    errorMsg = errorData.message;
                } else if (errorData?.detail) {
                    errorMsg = errorData.detail;
                } else if (typeof errorData === 'string') {
                    errorMsg = errorData;
                }
            } else if (err.request) {
                // La requête a été faite mais pas de réponse reçue (CORS, Réseau, etc.)
                errorMsg = "Le serveur est injoignable. Vérifiez la configuration CORS ou l'état du serveur backend sur Render.";
                console.error("No response received from server. Check CORS.");
            } else {
                // Erreur lors de la configuration de la requête
                errorMsg = "Erreur de configuration : " + err.message;
            }

            setError(String(errorMsg));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Mot de passe oublié ?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Adresse Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Adresse Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="text-green-600 text-sm text-center">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Retour à la connexion
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;

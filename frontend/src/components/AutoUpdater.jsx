import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const AutoUpdater = () => {
    const { t, language } = useLanguage();
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [currentVersion, setCurrentVersion] = useState(null);

    // Get translations for the updater (adding them here to avoid multi-file edits if possible, 
    // but better to have them in translations.js. For now, using hardcoded fallback/t() if exists)
    const strings = {
        fr: {
            title: "Mise à jour disponible",
            desc: "Une nouvelle version du site est disponible pour une meilleure expérience.",
            button: "Actualiser"
        },
        en: {
            title: "Update Available",
            desc: "A new version of the site is available for a better experience.",
            button: "Refresh"
        }
    };

    const currentStrings = strings[language] || strings.fr;

    const checkVersion = useCallback(async () => {
        try {
            const response = await fetch('/version.json?t=' + Date.now(), {
                cache: 'no-store'
            });
            const data = await response.json();

            if (!currentVersion) {
                // Initial load
                setCurrentVersion(data.version);
            } else if (data.version !== currentVersion) {
                // New version detected!
                setUpdateAvailable(true);
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }, [currentVersion]);

    useEffect(() => {
        // Check immediately on mount
        checkVersion();

        // Then check every 5 minutes
        const interval = setInterval(checkVersion, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [checkVersion]);

    const handleRefresh = () => {
        window.location.reload(true);
    };

    return (
        <AnimatePresence>
            {updateAvailable && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className="fixed bottom-8 left-1/2 z-[9999] w-[90%] max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gold p-5 flex items-start gap-4 overflow-hidden relative">
                        {/* Progress line simple */}
                        <div className="absolute top-0 left-0 h-1 bg-gold w-full"></div>

                        <div className="bg-gold/10 p-3 rounded-xl flex-shrink-0">
                            <FaInfoCircle className="text-gold text-xl" />
                        </div>

                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-900 mb-1">
                                {currentStrings.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                {currentStrings.desc}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRefresh}
                                    className="bg-gold text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-gold/20"
                                >
                                    <FaSync className="text-xs" />
                                    {currentStrings.button}
                                </button>
                                <button
                                    onClick={() => setUpdateAvailable(false)}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                    {language === 'fr' ? 'Plus tard' : 'Later'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setUpdateAvailable(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AutoUpdater;

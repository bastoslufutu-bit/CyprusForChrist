import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('fr');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage');
        if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const toggleLanguage = (lang) => {
        const newLanguage = lang ? lang : (language === 'fr' ? 'en' : 'fr');
        setLanguage(newLanguage);
        localStorage.setItem('appLanguage', newLanguage);
    };

    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${language}`);
                return key;
            }
        }

        // Handle variable substitution
        if (typeof value === 'string' && params) {
            return value.replace(/\{\{(\w+)\}\}/g, (_, k) => {
                return params[k] !== undefined ? params[k] : `{{${k}}}`;
            });
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

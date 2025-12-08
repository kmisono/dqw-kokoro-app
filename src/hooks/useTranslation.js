import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../lib/translations';

export function useTranslation() {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('ja')) {
            setLanguage('ja');
        } else {
            setLanguage('en');
        }
    }, []);

    const t = (key) => {
        const dict = TRANSLATIONS[language];
        if (!dict) {
            console.warn(`Translation dictionary missing for language: ${language}`);
            return key;
        }
        return dict[key] || key;
    };

    return { t, language };
}

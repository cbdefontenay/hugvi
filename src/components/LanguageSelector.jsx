import { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const languageOptions = [
    { language: "English", code: "en", flag: "🇬🇧" },
    { language: "Français", code: "fr", flag: "🇫🇷" },
    { language: "Deutsch", code: "de", flag: "🇩🇪" }
];

const LanguageSelector = () => {
    const [currentLanguage, setCurrentLanguage] = useState(i18next.language);
    const { i18n } = useTranslation();

    const handleLanguageChange = (code) => {
        setCurrentLanguage(code);
        i18next.changeLanguage(code);
    };

    useEffect(() => {
        document.body.dir = i18n.dir();
    }, [i18n, i18n.language]);

    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-(--surface-container-high) border border-(--outline-variant)">
            {languageOptions.map(({ language, code, flag }) => (
                <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`
            cursor-pointer w-10 h-10 flex items-center justify-center rounded-full
            text-sm font-mono transition-all duration-200
            ${currentLanguage === code
                        ? "bg-(--primary) text-(--on-primary) shadow-md scale-105"
                        : "bg-transparent text-(--on-surface-variant) hover:bg-(--surface-container)"}
          `}
                    title={language}
                    aria-label={`Switch to ${language}`}
                >
                    <span className="text-xl">{flag}</span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSelector;
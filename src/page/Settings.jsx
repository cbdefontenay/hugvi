import {useEffect, useState} from "react";
import {useTheme} from "../helpers/ThemeProvider";
import {useTranslation} from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import {Link} from "react-router-dom";
import {useDb} from "../helpers/DbContext.jsx";
import {handleClearAllDataAsync, handleClearEmptyNotesAsync} from "../helpers/DbHelpers.js";
import {Trash2, Database, Eraser, X} from "lucide-react";

export default function Settings() {
    const [mounted, setMounted] = useState(false);
    const {theme, changeTheme} = useTheme();
    const [activeTab, setActiveTab] = useState("appearance");
    const {t} = useTranslation();
    const {db, setFolders, setNotes, setActiveNote} = useDb();
    const [isClearing, setIsClearing] = useState(false);
    const [message, setMessage] = useState({type: '', text: ''});

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="ml-20 flex flex-col h-screen bg-(--background) text-(--on-background)">
            <div className="border-b border-(--outline-variant) p-4">
                <h1 className="text-2xl font-semibold">
                    {t("settings.header")}
                </h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-54 border-r border-(--outline-variant) p-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab("appearance")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "appearance" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            {t("settings.tabs.appearance")}
                        </button>
                        <button
                            onClick={() => setActiveTab("language")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "language" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            {t("settings.tabs.language")}
                        </button>
                        <button
                            onClick={() => setActiveTab("keyboard")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "keyboard" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            {t("settings.tabs.keyboard")}
                        </button>
                        <button
                            onClick={() => setActiveTab("data")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "data" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            Data Management
                        </button>
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "about" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            {t("settings.tabs.about")}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">{t("settings.appearance.title")}</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-medium">App Theme</h3>
                                    <p className="text-sm text-(--on-surface-variant)">
                                        Choose your preferred application theme
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <button
                                            onClick={() => changeTheme("light")}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-[var(--cursor-pointer,pointer)] ${theme === "light" ? "border-(--primary) bg-(--primary-container) text-(--on-primary-container)" : "border-(--outline-variant) hover:bg-(--surface-container-high) text-(--on-surface)"}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border border-(--outline-variant)" style={{backgroundColor: '#FEF7FF'}}></div>
                                            <span className="font-medium">Light</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => changeTheme("dark")}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${theme === "dark" ? "border-(--primary) bg-(--primary-container) text-(--on-primary-container)" : "border-(--outline-variant) hover:bg-(--surface-container-high) text-(--on-surface)"}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border border-(--outline-variant)" style={{backgroundColor: '#151218'}}></div>
                                            <span className="font-medium">Dark</span>
                                        </button>

                                        <button
                                            onClick={() => changeTheme("sepia")}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${theme === "sepia" ? "border-(--primary) bg-(--primary-container) text-(--on-primary-container)" : "border-(--outline-variant) hover:bg-(--surface-container-high) text-(--on-surface)"}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border border-(--outline-variant)" style={{backgroundColor: '#FCF8F4'}}></div>
                                            <span className="font-medium">Sepia</span>
                                        </button>

                                        <button
                                            onClick={() => changeTheme("ocean")}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${theme === "ocean" ? "border-(--primary) bg-(--primary-container) text-(--on-primary-container)" : "border-(--outline-variant) hover:bg-(--surface-container-high) text-(--on-surface)"}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border border-(--outline-variant)" style={{backgroundColor: '#0F1724'}}></div>
                                            <span className="font-medium">Ocean</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "language" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">{t("settings.language.title")}</h2>
                            <div className="space-y-4">
                                <LanguageSelector/>
                            </div>
                        </div>
                    )}

                    {activeTab === "data" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Database size={24} className="text-(--primary)" />
                                {t("settings.data.title")}
                            </h2>
                            <p className="text-(--on-surface-variant)">
                                {t("settings.data.description")}
                            </p>

                            {message.text && (
                                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-(--error-container) text-(--on-error-container)' : 'bg-(--primary-container) text-(--on-primary-container)'}`}>
                                    <span className="flex-1">{message.text}</span>
                                    <button onClick={() => setMessage({type: '', text: ''})} className="hover:opacity-70">
                                        <X size={18} />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="p-5 border border-(--outline-variant) rounded-2xl bg-(--surface-container-low) flex items-center justify-between group hover:border-(--primary/30) transition-all">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-lg flex items-center gap-2">
                                            <Eraser size={18} className="text-(--primary)" />
                                            {t("settings.data.cleanupTitle")}
                                        </div>
                                        <p className="text-sm text-(--on-surface-variant)">
                                            {t("settings.data.cleanupDesc")}
                                        </p>
                                    </div>
                                    <button
                                        disabled={isClearing}
                                        onClick={async () => {
                                            setIsClearing(true);
                                            try {
                                                await handleClearEmptyNotesAsync(db, setNotes);
                                                setMessage({type: 'success', text: t("settings.data.cleanupSuccess")});
                                            } catch (e) {
                                                setMessage({type: 'error', text: t("settings.data.cleanupError")});
                                            } finally {
                                                setIsClearing(false);
                                            }
                                        }}
                                        className="cursor-pointer px-4 py-2 rounded-full border border-(--outline) hover:bg-(--surface-container-high) text-(--on-surface) font-medium transition-colors disabled:opacity-50"
                                    >
                                        {t("settings.data.cleanupButton")}
                                    </button>
                                </div>

                                <div className="p-5 border border-(--error/20) rounded-2xl bg-(--error-container/10) flex items-center justify-between group hover:bg-(--error-container/20) transition-all">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-lg flex items-center gap-2 text-(--error)">
                                            <Trash2 size={18} />
                                            {t("settings.data.resetTitle")}
                                        </div>
                                        <p className="text-sm text-(--on-surface-variant)">
                                            {t("settings.data.resetDesc")}
                                        </p>
                                    </div>
                                    <button
                                        disabled={isClearing}
                                        onClick={async () => {
                                            if (confirm(t("settings.data.resetConfirm"))) {
                                                setIsClearing(true);
                                                try {
                                                    await handleClearAllDataAsync(db, setFolders, setNotes, setActiveNote);
                                                    setMessage({type: 'success', text: t("settings.data.resetSuccess")});
                                                } catch (e) {
                                                    setMessage({type: 'error', text: t("settings.data.resetError")});
                                                } finally {
                                                    setIsClearing(false);
                                                }
                                            }
                                        }}
                                        className="cursor-pointer px-4 py-2 rounded-full bg-(--error) text-(--on-error) hover:bg-(--error-hover) font-medium transition-colors disabled:opacity-50"
                                    >
                                        {t("settings.data.resetButton")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">{t("settings.about.title")}</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 bg-(--primary) rounded-lg flex items-center justify-center text-(--on-primary) text-2xl font-bold">
                                        <img src="/logo.svg" alt="logo"/>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Hugvi</h3>
                                        <p className="text-sm text-[var(--on-surface-variant)]">Version 1.3.0</p>
                                    </div>
                                </div>
                                <div className="text-justify">
                                    <h3 className="font-medium mb-2">{t("settings.about.descriptionTitle")}</h3>
                                    <p className="text-(--on-surface-variant)">
                                        {t("settings.about.description")}
                                    </p>
                                    <p className="text-(--on-surface-variant) mt-2">
                                        {t("settings.about.descriptionTwo")}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">{t("settings.about.links")}</h3>
                                    <div className="flex gap-4">
                                        <span className="text-(--primary)">
                                            GitHub:
                                        </span>
                                        <span className="select-all text-(--secondary) underline">
                                            https://github.com/cbdefontenay/hugvi
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
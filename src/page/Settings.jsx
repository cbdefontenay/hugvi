import {useEffect, useState} from "react";
import {useTheme} from "../helpers/ThemeProvider";
import {useTranslation} from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import {Link} from "react-router-dom";

export default function Settings() {
    const [mounted, setMounted] = useState(false);
    const {theme, toggleTheme} = useTheme();
    const [activeTab, setActiveTab] = useState("appearance");
    const {t} = useTranslation();

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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{t("settings.appearance.darkMode")}</h3>
                                        <p className="text-sm text-(--on-surface-variant)">
                                            {t("settings.appearance.description")}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={theme === "dark"}
                                            onChange={toggleTheme}
                                        />
                                        <div
                                            className="w-11 h-6 bg-(--surface-container-high) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--on-surface)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                    </label>
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

                    {activeTab === "keyboard" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">{t("settings.keyboard.title")}</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium">{t("settings.keyboard.saveNote")}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <kbd
                                                className="px-2 py-1 bg-(--surface-container-high) rounded text-sm">Ctrl</kbd>
                                            <kbd
                                                className="px-2 py-1 bg-(--surface-container-high) rounded text-sm">S</kbd>
                                        </div>
                                    </div>
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
                                        <p className="text-sm text-[var(--on-surface-variant)]">Version 1.2.0</p>
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
import {useEffect, useState} from "react";
import {useTheme} from "../helpers/ThemeProvider";
import {useTranslation} from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import {Link} from "react-router-dom";
import {useDb} from "../helpers/DbContext.jsx";
import {handleClearAllDataAsync, handleClearEmptyNotesAsync} from "../helpers/DbHelpers.js";
import {Trash2, Database, Eraser, X, Check, Palette, Sun, Moon, Coffee, Waves, Terminal, RefreshCw, ExternalLink, CircleCheck, CircleX, Star, Heart, Leaf, Flame, Download} from "lucide-react";

export default function Settings() {
    const [mounted, setMounted] = useState(false);
    const {theme, changeTheme} = useTheme();
    const [activeTab, setActiveTab] = useState("appearance");
    const {t} = useTranslation();
    const {db, setFolders, setNotes, setActiveNote} = useDb();
    const [isClearing, setIsClearing] = useState(false);
    const [message, setMessage] = useState({type: '', text: ''});
    const [useCtrlS, setUseCtrlS] = useState(() => {
        return localStorage.getItem('useCtrlS') !== 'false';
    });
    const [checkingUpdate, setCheckingUpdate] = useState(false);
    const [updateResult, setUpdateResult] = useState(null);
    const [updateError, setUpdateError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloadResult, setDownloadResult] = useState(null);
    const [downloadError, setDownloadError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('useCtrlS', useCtrlS.toString());
    }, [useCtrlS]);

    if (!mounted) return null;

    return (
        <div className="md:ml-20 flex flex-col h-screen bg-(--background) text-(--on-background)">
            <div className="border-b border-(--outline-variant) p-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    {t("settings.header")}
                </h1>
            </div>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-(--outline-variant) p-2 md:p-4 overflow-x-auto whitespace-nowrap md:whitespace-normal no-scrollbar">
                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1">
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
                        <button
                            onClick={() => setActiveTab("updates")}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded-md ${activeTab === "updates" ? "bg-(--primary-container) text-(--on-primary-container)" : "hover:bg-(--surface-container-high)"}`}
                        >
                            {t("settings.tabs.updates")}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
{activeTab === "appearance" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-(--primary-container) text-(--on-primary-container)">
                                        <Palette size={24} />
                                    </div>
                                    {t("settings.appearance.title")}
                                </h2>
                                <p className="text-(--on-surface-variant) mt-2 ml-14">
                                    {t("settings.appearance.themeDescription")}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[
                                    { id: "light", icon: Sun, bg: "#FEF7FF", bar: "#E8D5F0", text: "#4A3F5C", accent: "#D3BCFD", tag: "light" },
                                    { id: "dark", icon: Moon, bg: "#151218", bar: "#332D3D", text: "#E7E0E8", accent: "#D3BCFD", tag: "dark" },
                                    { id: "sepia", icon: Coffee, bg: "#FCF8F4", bar: "#E8DFD0", text: "#5C4B37", accent: "#8C6D5C", tag: "sepia" },
                                    { id: "ocean", icon: Waves, bg: "#0F1724", bar: "#1A2744", text: "#C8D6E5", accent: "#4A90D9", tag: "ocean" },
                                    { id: "hacker-dark", icon: Terminal, bg: "#050505", bar: "#141E14", text: "#39FF14", accent: "#39FF14", tag: "hacker-dark" },
                                    { id: "hacker-light", icon: Terminal, bg: "#F0F8F0", bar: "#C8E6C8", text: "#005000", accent: "#008000", tag: "hacker-light" },
                                    { id: "midnight-blue", icon: Star, bg: "#0A0F19", bar: "#162030", text: "#E1E6F0", accent: "#64B4FF", tag: "midnight-blue" },
                                    { id: "rose-gold-dark", icon: Heart, bg: "#140F12", bar: "#211A1E", text: "#EBE1E1", accent: "#FF96AA", tag: "rose-gold-dark" },
                                    { id: "forest-dark", icon: Leaf, bg: "#0F140F", bar: "#191E19", text: "#E1EBDC", accent: "#82DC82", tag: "forest-dark" },
                                    { id: "peach-light", icon: Flame, bg: "#FFF8F0", bar: "#FFE8D0", text: "#231C19", accent: "#FF783C", tag: "peach-light" },
                                ].map((tItem) => {
                                    const Icon = tItem.icon;
                                    const isActive = theme === tItem.id;
                                    return (
                                        <button
                                            key={tItem.id}
                                            onClick={() => changeTheme(tItem.id)}
                                            className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${
                                                isActive
                                                    ? "border-(--primary) shadow-lg scale-[1.02]"
                                                    : "border-(--outline-variant) hover:border-(--primary)/50 hover:shadow-md hover:scale-[1.01]"
                                            }`}
                                        >
                                            {/* Preview Mockup */}
                                            <div className="relative" style={{ backgroundColor: tItem.bg }}>
                                                {/* Title bar */}
                                                <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ backgroundColor: tItem.bar, borderColor: 'rgba(128,128,128,0.15)' }}>
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }}></div>
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }}></div>
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }}></div>
                                                    <div className="flex-1 mx-2 h-4 rounded" style={{ backgroundColor: tItem.text, opacity: 0.15 }}></div>
                                                </div>
                                                {/* Sidebar + Content */}
                                                <div className="flex">
                                                    {/* Sidebar */}
                                                    <div className="w-12 py-2 border-r" style={{ borderColor: 'rgba(128,128,128,0.12)', backgroundColor: tItem.bar }}>
                                                        <div className="mx-1.5 mb-1.5 h-2.5 rounded-sm" style={{ backgroundColor: tItem.text, opacity: 0.25 }}></div>
                                                        <div className="mx-1.5 mb-1.5 h-2.5 rounded-sm" style={{ backgroundColor: tItem.accent, opacity: 0.4 }}></div>
                                                        <div className="mx-1.5 mb-1.5 h-2.5 rounded-sm" style={{ backgroundColor: tItem.text, opacity: 0.25 }}></div>
                                                        <div className="mx-1.5 mb-1.5 h-2.5 rounded-sm" style={{ backgroundColor: tItem.text, opacity: 0.15 }}></div>
                                                    </div>
                                                    {/* Editor area */}
                                                    <div className="flex-1 p-2.5 space-y-1.5">
                                                        <div className="h-2 rounded" style={{ backgroundColor: tItem.text, opacity: 0.5, width: '70%' }}></div>
                                                        <div className="h-2 rounded" style={{ backgroundColor: tItem.text, opacity: 0.3, width: '90%' }}></div>
                                                        <div className="h-2 rounded" style={{ backgroundColor: tItem.text, opacity: 0.3, width: '60%' }}></div>
                                                        <div className="h-2 rounded" style={{ backgroundColor: tItem.accent, opacity: 0.35, width: '80%' }}></div>
                                                        <div className="h-2 rounded" style={{ backgroundColor: tItem.text, opacity: 0.2, width: '45%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Active indicator */}
                                            {isActive && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-(--primary) flex items-center justify-center shadow-md">
                                                    <Check size={14} style={{ color: tItem.bg }} />
                                                </div>
                                            )}
                                            {/* Label */}
                                            <div className={`px-3 py-2.5 flex items-center justify-between border-t ${
                                                isActive ? "bg-(--primary-container)" : "bg-(--surface-container-low)"
                                            }`}>
                                                <span className={`text-sm font-medium ${isActive ? "text-(--on-primary-container)" : "text-(--on-surface)"}`}>
                                                    {t(`settings.appearance.themes.${tItem.tag}`)}
                                                </span>
                                                <Icon size={16} className={isActive ? "text-(--on-primary-container)" : "text-(--on-surface-variant)"} />
                                            </div>
                                        </button>
                                    );
                                })}
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
                                <div className="p-5 border border-(--outline-variant) rounded-2xl bg-(--surface-container-low) flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-lg flex items-center gap-2">
                                            <span className="text-(--primary)">⌘</span>
                                            {t("settings.keyboard.saveNote")}
                                        </div>
                                        <p className="text-sm text-(--on-surface-variant)">
                                            {t("settings.keyboard.useCtrlS")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setUseCtrlS(!useCtrlS)}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                            useCtrlS 
                                                ? 'bg-(--primary) text-(--on-primary)' 
                                                : 'bg-(--surface-container-high) text-(--on-surface-variant) border border-(--outline)'
                                        }`}
                                    >
                                        {useCtrlS ? t('common.on') : t('common.off')}
                                    </button>
                                </div>
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

                    {activeTab === "updates" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-(--primary-container) text-(--on-primary-container)">
                                    <RefreshCw size={24} />
                                </div>
                                {t("settings.updates.title")}
                            </h2>
                            <p className="text-(--on-surface-variant) mt-2 ml-14">
                                {t("settings.updates.description")}
                            </p>

                            <div className="p-5 border border-(--outline-variant) rounded-2xl bg-(--surface-container-low) space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-lg">{t("settings.updates.checkTitle")}</div>
                                        <p className="text-sm text-(--on-surface-variant) mt-1">
                                            {t("settings.updates.checkDesc")}
                                        </p>
                                    </div>
                                    <button
                                        disabled={checkingUpdate}
                                        onClick={async () => {
                                            setCheckingUpdate(true);
                                            setUpdateResult(null);
                                            setUpdateError('');
                                            try {
                                                const { invoke } = await import('@tauri-apps/api/core');
                                                const result = await invoke('check_for_updates');
                                                setUpdateResult(result);
                                            } catch (e) {
                                                setUpdateError(t("settings.updates.checkError"));
                                            } finally {
                                                setCheckingUpdate(false);
                                            }
                                        }}
                                        className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full bg-(--primary) text-(--on-primary) hover:opacity-90 font-medium transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw size={16} className={checkingUpdate ? "animate-spin" : ""} />
                                        {checkingUpdate ? t("settings.updates.checking") : t("settings.updates.checkButton")}
                                    </button>
                                </div>

                                {updateError && (
                                    <div className="p-4 rounded-lg bg-(--error-container) text-(--on-error-container) flex items-center gap-3">
                                        <CircleX size={18} />
                                        <span>{updateError}</span>
                                    </div>
                                )}

                                {updateResult && updateResult.has_update && (
                                    <div className="p-4 rounded-lg bg-(--primary-container) text-(--on-primary-container) space-y-3">
                                        <div className="flex items-center gap-3">
                                            <CircleCheck size={18} />
                                            <span className="font-semibold">{t("settings.updates.available")}</span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <p>{t("settings.updates.currentVersion")}: <strong>{updateResult.current_version}</strong></p>
                                            <p>{t("settings.updates.latestVersion")}: <strong>{updateResult.latest_version}</strong></p>
                                        </div>
                                        
                                        {downloadError && (
                                            <div className="p-3 rounded-lg bg-(--error-container) text-(--on-error-container) flex items-center gap-2 text-sm">
                                                <CircleX size={16} />
                                                <span>{downloadError}</span>
                                            </div>
                                        )}

                                        {downloadResult && (
                                            <div className="p-3 rounded-lg bg-(--surface-container-high) text-(--on-surface) space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CircleCheck size={16} className="text-(--primary)" />
                                                    <span>{t("settings.updates.downloadComplete")}</span>
                                                </div>
                                                <p className="text-xs text-(--on-surface-variant) font-mono break-all">
                                                    {downloadResult.file_path}
                                                </p>
                                                <p className="text-xs text-(--on-surface-variant)">
                                                    {t("settings.updates.installInstructions")}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                disabled={downloading}
                                                onClick={async () => {
                                                    setDownloading(true);
                                                    setDownloadResult(null);
                                                    setDownloadError('');
                                                    try {
                                                        const { invoke } = await import('@tauri-apps/api/core');
                                                        const result = await invoke('download_update');
                                                        setDownloadResult(result);
                                                    } catch (e) {
                                                        setDownloadError(t("settings.updates.downloadError"));
                                                    } finally {
                                                        setDownloading(false);
                                                    }
                                                }}
                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--primary) text-(--on-primary) hover:opacity-90 font-medium transition-colors text-sm disabled:opacity-50"
                                            >
                                                <Download size={14} className={downloading ? "animate-spin" : ""} />
                                                {downloading ? t("settings.updates.downloading") : t("settings.updates.downloadButton")}
                                            </button>
                                            <a
                                                href={updateResult.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-(--outline) hover:bg-(--surface-container-high) text-(--on-surface) font-medium transition-colors text-sm cursor-pointer"
                                            >
                                                <ExternalLink size={14} />
                                                {t("settings.updates.openReleases")}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {updateResult && !updateResult.has_update && !updateError && (
                                    <div className="p-4 rounded-lg bg-(--surface-container-high) text-(--on-surface) flex items-center gap-3">
                                        <CircleCheck size={18} className="text-(--primary)" />
                                        <span>{t("settings.updates.upToDate")}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
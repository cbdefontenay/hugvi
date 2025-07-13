"use client";

import {useEffect, useState} from "react";
import {useTheme} from "@/components/ThemProvider";

export default function Settings() {
    const [mounted, setMounted] = useState(false);
    const {theme, toggleTheme} = useTheme();
    const [activeTab, setActiveTab] = useState("appearance");

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="ml-20 flex flex-col h-screen bg-[var(--background)] text-[var(--on-background)]">
            {/* Header */}
            <div className="border-b border-[var(--outline-variant)] p-4">
                <h1 className="text-2xl font-semibold">Settings</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-[var(--outline-variant)] p-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab("appearance")}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "appearance" ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]" : "hover:bg-[var(--surface-container-high)]"}`}
                        >
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveTab("keyboard")}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "keyboard" ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]" : "hover:bg-[var(--surface-container-high)]"}`}
                        >
                            Keyboard Shortcuts
                        </button>
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "about" ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]" : "hover:bg-[var(--surface-container-high)]"}`}
                        >
                            About
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Appearance</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Dark Mode</h3>
                                        <p className="text-sm text-[var(--on-surface-variant)]">
                                            Switch between light and dark theme
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
                                            className="w-11 h-6 bg-[var(--surface-container-high)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--on-surface)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "keyboard" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium">New Note</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <kbd
                                                className="px-2 py-1 bg-[var(--surface-container-high)] rounded text-sm">Ctrl</kbd>
                                            <kbd
                                                className="px-2 py-1 bg-[var(--surface-container-high)] rounded text-sm">N</kbd>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Save Note</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <kbd
                                                className="px-2 py-1 bg-[var(--surface-container-high)] rounded text-sm">Ctrl</kbd>
                                            <kbd
                                                className="px-2 py-1 bg-[var(--surface-container-high)] rounded text-sm">S</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">About</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 bg-[var(--primary)] rounded-lg flex items-center justify-center text-[var(--on-primary)] text-2xl font-bold">
                                        Hugvi
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Code Notes</h3>
                                        <p className="text-sm text-[var(--on-surface-variant)]">Version 1.0.0</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-[var(--on-surface-variant)]">
                                        A simple and elegant code note-taking application built with Tauri and Next.js.
                                        Organize your code snippets, notes, and ideas in one place.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Links</h3>
                                    <div className="flex gap-4">
                                        <a href="#" className="text-[var(--primary)] hover:underline">GitHub</a>
                                        <a href="#" className="text-[var(--primary)] hover:underline">Report Issue</a>
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
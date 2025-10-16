import {useState} from "react";
import {useTranslation} from "react-i18next";
import {FaPalette} from "react-icons/fa";

export const THEMES = [
    {name: "nord", display: "Nord"},
    {name: "atomDark", display: "Atom Dark"},
    {name: "darcula", display: "Darcula"},
    {name: "gruvboxDark", display: "Gruvbox Dark"},
    {name: "materialDark", display: "Material Dark"},
    {name: "materialLight", display: "Material Light"},
    {name: "solarizedlight", display: "Solarized Light"},
    {name: "tomorrow", display: "Tomorrow"},
    {name: "vscDarkPlus", display: "VS Code Dark+"}
];

export default function ThemeSelector({ selectedTheme, onThemeChange }) {
    const {t} = useTranslation();
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const toggleThemeMenu = () => setShowThemeMenu(!showThemeMenu);

    const selectTheme = (themeName) => {
        onThemeChange(themeName);
        setShowThemeMenu(false);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleThemeMenu}
                className="cursor-pointer flex items-center space-x-1 px-3 py-1 rounded-md text-sm bg-(--surface-container-high) text-(--on-surface-variant) hover:bg-(--surface-container)"
                aria-label={t("editor.selectTheme")}
            >
                <FaPalette size={14} />
                <span>{t("editor.theme")}</span>
            </button>

            {showThemeMenu && (
                <div
                    className="absolute right-0 mt-1 w-48 bg-(--surface) rounded-md shadow-lg z-50 border border-(--outline-variant)">
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => selectTheme(theme.name)}
                                className={`cursor-pointer block w-full text-left px-4 py-2 text-sm ${selectedTheme === theme.name ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface) hover:bg-(--surface-container-high)'}`}
                            >
                                {theme.display}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
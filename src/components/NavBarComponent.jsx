import {useState} from "react";
import {Link, Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useFullscreen} from "../helpers/FullscreenContext.jsx";

export default function NavBarComponent() {
    const [isExpanded, setIsExpanded] = useState(false);
    const {isFullscreen} = useFullscreen();
    const {t} = useTranslation();

    // Toggle sidebar on mobile
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Navigation items
    const navItems = [
        {
            nameKey: "navbar.home",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            ),
            path: "/",
        },
        {
            nameKey: "navbar.settings",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="3"/>
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
            ),
            path: "/settings",
        },
    ];

    return (
        <>
            {/* Sidebar - hidden on mobile, only visible on desktop */}
            <aside
                className={`
        fixed top-0 left-0 h-full z-20
        bg-(--surface-container-lowest) border-r border-(--outline-variant)
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-20"}
        ${isExpanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isFullscreen ? "hidden" : "block"}
        md:block hidden
      `}
            >
                <nav className="h-full flex flex-col pt-6">
                    <ul className="space-y-6 px-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} passHref>
                                    <div
                                        className={`
                    flex items-center p-3 rounded-lg cursor-pointer
                    hover:bg-(--surface-container-high) transition-colors
                    group relative
                  `}
                                    >
                                        <div className="text-(--on-surface-variant) group-hover:text-(--on-surface)">
                                            {item.icon}
                                        </div>
                                        {/* Tooltip (visible on hover when collapsed) */}
                                        {!isExpanded && (
                                            <span
                                                className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-(--surface-container-high) text-(--on-surface) text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                                                {t(item.nameKey)}
                                            </span>
                                        )}
                                        {isExpanded && (
                                            <span className="ml-4 text-(--on-surface) font-medium">
                                                {t(item.nameKey)}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation Bar - only visible on small screens */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-(--surface-container-lowest) border-t border-(--outline-variant) z-50 flex items-center justify-around md:hidden pb-safe">
                {navItems.map((item) => (
                    <Link
                        key={item.nameKey}
                        to={item.path}
                        className="flex flex-col items-center justify-center space-y-1 w-full h-full text-(--on-surface-variant) hover:text-(--primary) transition-colors"
                    >
                        <div className="flex items-center justify-center p-1 rounded-full transition-colors active:bg-(--surface-container-high)">
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wider">{t(item.nameKey)}</span>
                    </Link>
                ))}
            </nav>

            <main className="pb-16 md:pb-0">
                <Outlet/>
            </main>
        </>
    );
}
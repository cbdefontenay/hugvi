import {useState} from "react";
import {Link, Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function NavBarComponent() {
    const [isExpanded, setIsExpanded] = useState(false);
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
            {/* Mobile toggle button */}
            <button
                onClick={toggleSidebar}
                className="fixed md:hidden bottom-4 left-4 z-50 p-3 rounded-full bg-(--primary) text-(--on-primary) shadow-lg"
            >
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
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`
        fixed top-0 left-0 h-full z-40
        bg-(--surface-container-lowest) border-r border-(--outline-variant)
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-20"}
        ${isExpanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
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

            {/* Overlay for mobile */}
            {isExpanded && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                />
            )}
            <main className="">
                <Outlet/>
            </main>
        </>
    );
}
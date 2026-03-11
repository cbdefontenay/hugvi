import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Get theme from localStorage or use light as default
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);

        // Apply the theme class to the html element
        document.documentElement.className = savedTheme;
    }, []);

    const toggleTheme = () => {
        // Fallback toggle for quick light/dark
        const newTheme = theme === "dark" || theme === "ocean" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.className = newTheme;
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.className = newTheme;
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
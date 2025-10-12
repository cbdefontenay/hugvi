import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";

export default function ToastComponent({ message, type = "error", onClose, duration = 5000 }) {
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-green-500 dark:bg-green-600",
                    text: "text-white",
                    icon: <FaCheckCircle className="w-5 h-5" />
                };
            case "warning":
                return {
                    bg: "bg-amber-500 dark:bg-amber-600",
                    text: "text-white",
                    icon: <FaExclamationTriangle className="w-5 h-5" />
                };
            case "error":
            default:
                return {
                    bg: "bg-red-500 dark:bg-red-600",
                    text: "text-white",
                    icon: <FaExclamationCircle className="w-5 h-5" />
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div className={`fixed top-6 right-6 z-50 max-w-sm w-full`}>
            <div className={`flex items-start p-4 rounded-xl shadow-lg border border-opacity-20 ${styles.bg} ${styles.text} animate-in slide-in-from-right-8 duration-300 backdrop-blur-sm bg-opacity-95`}>
                <div className="flex-shrink-0 mt-0.5">
                    {styles.icon}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium leading-5">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    aria-label={t("common.close")}
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
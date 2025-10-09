import {useTranslation} from "react-i18next";
import {invoke} from "@tauri-apps/api/core";
import {useState} from "react";
import {FaFileAlt, FaFileCode, FaTimes, FaArrowRight, FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";

function Toast({message, type, onClose}) {
    const bgColor = type === 'error' ? 'alert-error' : 'alert-success';
    const Icon = type === 'error' ? FaExclamationTriangle : FaCheckCircle;

    return (
        <div className="toast toast-top toast-center z-[100]">
            <div className={`alert ${bgColor} shadow-lg`}>
                <Icon className="text-lg"/>
                <span>{message}</span>
                <button onClick={onClose} className="btn btn-ghost btn-sm">
                    <FaTimes/>
                </button>
            </div>
        </div>
    );
}

export default function ExportPopup({isOpen, onClose, content}) {
    const {t} = useTranslation();
    const [toast, setToast] = useState({show: false, message: '', type: ''});

    const showToast = (message, type = 'error') => {
        setToast({show: true, message, type});
        setTimeout(() => {
            setToast({show: false, message: '', type: ''});
        }, 4000);
    };

    const handleExport = async (format) => {
        try {
            await invoke("export_note", {content, format});
            showToast(t("editor.exportSuccess"), 'success');
            onClose();
        } catch (error) {
            showToast(t("editor.exportFailed"), 'error');
        }
    };
    if (!isOpen) return null;

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({show: false, message: '', type: ''})}
                />
            )}

            {/* Export Popup */}
            <div className="fixed inset-0 bg-(--background)/50 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-(--surface) rounded-xl p-6 max-w-sm w-full mx-4 border border-(--outline-variant)">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-(--on-surface)">
                            {t("editor.exportNote")}
                        </h3>
                        <button
                            onClick={onClose}
                            className="cursor-pointer p-1 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            aria-label={t("common.close")}>
                            <FaTimes size={16}/>
                        </button>
                    </div>
                    <p className="text-(--on-surface-variant) mb-6">
                        {t("editor.exportDescription")}
                    </p>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => handleExport("md")}
                            className="cursor-pointer flex items-center justify-between p-4 rounded-lg border border-(--outline-variant) hover:bg-(--surface-container-high) transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-lg bg-(--primary-container) flex items-center justify-center group-hover:bg-(--primary) transition-colors">
                                    <FaFileCode
                                        className="text-(--on-primary-container) group-hover:text-(--on-primary) text-lg"/>
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-(--on-surface)">
                                        {t("editor.exportMarkdown")}
                                    </div>
                                    <div className="text-sm text-(--on-surface-variant)">
                                        .md {t("editor.format")}
                                    </div>
                                </div>
                            </div>
                            <FaArrowRight
                                className="text-(--on-surface-variant) group-hover:text-(--primary) transition-colors"/>
                        </button>
                        <button
                            onClick={() => handleExport("txt")}
                            className="cursor-pointer flex items-center justify-between p-4 rounded-lg border border-(--outline-variant) hover:bg-(--surface-container-high) transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-lg bg-(--secondary-container) flex items-center justify-center group-hover:bg-(--secondary) transition-colors">
                                    <FaFileAlt
                                        className="text-(--on-secondary-container) group-hover:text-(--on-secondary) text-lg"/>
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-(--on-surface)">
                                        {t("editor.exportText")}
                                    </div>
                                    <div className="text-sm text-(--on-surface-variant)">
                                        .txt {t("editor.format")}
                                    </div>
                                </div>
                            </div>
                            <FaArrowRight
                                className="text-(--on-surface-variant) group-hover:text-(--secondary) transition-colors"/>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer w-full mt-4 px-4 py-2 rounded-lg text-(--on-surface-variant) hover:bg-(--surface-container-high) transition-colors">
                        {t("common.cancel")}
                    </button>
                </div>
            </div>
        </>
    );
}
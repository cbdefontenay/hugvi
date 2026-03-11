import React from 'react';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        const { t } = this.props;
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-(--surface-container-low)">
                    <h2 className="text-xl font-bold text-(--error) mb-4">
                        {t ? t("error.title") : "Something went wrong in the editor."}
                    </h2>
                    <p className="text-(--on-surface-variant) mb-6">
                        {t ? t("error.message") : ""}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="cursor-pointer px-4 py-2 bg-(--primary) text-(--on-primary) rounded-lg hover:bg-(--primary-hover) font-sm"
                    >
                        {t ? t("error.recover") : "Try to recover"}
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);

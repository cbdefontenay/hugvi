import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {
    atomDark,
    darcula,
    ghcolors,
    gruvboxDark,
    materialDark,
    materialLight,
    nord,
    solarizedlight,
    tomorrow,
    vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTranslation} from "react-i18next";
import {FaCopy, FaCheck} from "react-icons/fa";
import {useState} from "react";

const THEME_MAP = {
    nord: nord,
    atomDark: atomDark,
    darcula: darcula,
    gruvboxDark: gruvboxDark,
    materialDark: materialDark,
    materialLight: materialLight,
    solarizedlight: solarizedlight,
    ghcolors: ghcolors,
    tomorrow: tomorrow,
    vscDarkPlus: vscDarkPlus
};

export default function SyntaxHighlighterComponent({
                                                       language,
                                                       children,
                                                       theme = "nord",
                                                       ...props
                                                   }) {
    const {t} = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(children));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative group my-3 overflow-x-auto">
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                <span className="text-xs px-2 py-1 bg-(--surface-container-high) text-(--on-surface-container-high) rounded border border-(--outline)">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-(--surface-container-high) border border-(--outline) hover:bg-(--surface-container-highest) transition-all duration-200 group"
                    title={t("editor.copyCode")}
                >
                    {copied ? (
                        <FaCheck size={12} className="text-green-500" />
                    ) : (
                        <FaCopy size={12} className="text-(--on-surface-container-high) group-hover:text-(--primary)" />
                    )}
                </button>
            </div>

            <SyntaxHighlighter
                style={THEME_MAP[theme]}
                language={language}
                PreTag="div"
                className="rounded-lg border border-(--outline) shadow-lg syntax-highlighter"
                showLineNumbers={false}
                wrapLines={false}
                wrapLongLines={true}
                customStyle={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                    margin: 0,
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                }}
                codeTagProps={{
                    style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        display: 'block',
                        padding: '1rem'
                    }
                }}
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
}
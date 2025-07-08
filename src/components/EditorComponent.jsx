"use client";

import {useState} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {nord} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function EditorComponent() {
    const [inputText, setInputText] = useState(`\
# Heading

\`\`\`js
console.log("Hello from JS")
\`\`\`

\`\`\`python
print("Hello from Python")
\`\`\`
`);

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
                Live Markdown Preview
            </h1>

            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Write some markdown here..."
            />

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 prose prose-fuchsia">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || "");

                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={nord}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers
                                    wrapLines
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {inputText}
                </Markdown>
            </div>
        </div>
    );
}
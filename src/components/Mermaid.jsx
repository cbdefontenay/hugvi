import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid once at module level
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#68548e',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#68548e',
    lineColor: '#7a757f',
    secondaryColor: '#68548d',
    tertiaryColor: '#7f525d',
  },
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  // Suppress the default error behavior
  suppressErrorConsole: true,
});

// Unique counter for IDs
let mermaidCount = 0;

const Mermaid = ({ chart }) => {
  const [error, setError] = useState(null);
  const [svg, setSvg] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !chart.trim()) return;
      
      try {
        // Basic syntax check before rendering
        await mermaid.parse(chart.trim());
        
        setError(null);
        const id = `mermaid-svg-${++mermaidCount}`;
        
        // Use mermaid.render which returns { svg, bindFunctions } in v10+
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        
        if (isMounted.current) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted.current) {
          setError(err.message || 'Failed to render diagram');
        }
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 my-6 bg-error-container text-on-error-container rounded-lg border border-error/30 text-xs shadow-sm">
        <p className="font-bold mb-1">Diagram Error:</p>
        <pre className="whitespace-pre-wrap font-mono opacity-80">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="h-20 animate-pulse bg-surface-container rounded-lg my-6" />;
  }

  return (
    <div 
      className="mermaid-container flex justify-center my-6 overflow-x-auto p-3 md:p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-sm transition-all"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;

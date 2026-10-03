'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Calculator, X, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface EmbeddedDesmosProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbeddedDesmos: React.FC<EmbeddedDesmosProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calculatorInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load Desmos API script if not loaded
    const scriptId = 'desmos-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initCalculator = () => {
      if ((window as any).Desmos && containerRef.current && !calculatorInstanceRef.current) {
        calculatorInstanceRef.current = (window as any).Desmos.GraphingCalculator(containerRef.current, {
          keypad: true,
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
          border: false
        });
        setIsLoaded(true);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = initCalculator;
      document.head.appendChild(script);
    } else {
      if ((window as any).Desmos) {
        initCalculator();
      } else {
        script.addEventListener('load', initCalculator);
      }
    }

    return () => {
      // Keep calculator alive or clean up
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    if (calculatorInstanceRef.current) {
      calculatorInstanceRef.current.setBlank();
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-200 shadow-2xl flex flex-col rounded-3xl overflow-hidden border-2 border-[#86efac]/50 bg-[#0d2112] ${
        isExpanded
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 w-[92vw] sm:w-[580px] h-[520px]'
      }`}
    >
      {/* Header Bar */}
      <div className="p-3 bg-[#132d18] border-b border-[#86efac]/30 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">
            <Calculator className="w-4 h-4 text-emerald-400" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider font-['JetBrains_Mono'] text-emerald-200">
            Digital SAT Graphing Calculator (Desmos API)
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-300 hover:text-white transition"
            title="Reset Graph"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-300 hover:text-white transition"
            title={isExpanded ? 'Restore Size' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rose-600 text-white transition ml-1"
            title="Close Calculator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desmos Mounting Container */}
      <div className="flex-1 relative bg-white">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#071521] text-emerald-300 text-xs font-mono">
            Loading official Desmos engine...
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

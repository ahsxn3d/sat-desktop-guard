'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, RotateCcw, X, Palette, Circle } from 'lucide-react';

interface DigitalScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalScratchpad: React.FC<DigitalScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#86efac'); // matcha green default
  const [lineWidth, setLineWidth] = useState(3);

  const colors = [
    { label: 'Matcha Green', value: '#86efac' },
    { label: 'Amber Gold', value: '#facc15' },
    { label: 'Coral Red', value: '#f87171' },
    { label: 'Cyan Sky', value: '#38bdf8' },
    { label: 'Pure White', value: '#ffffff' }
  ];

  // Adjust canvas size to window
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-auto">
      {/* Top Floating Scratchpad Toolbar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 p-2 rounded-2xl bg-[#0d2112]/90 backdrop-blur-md border border-[#86efac]/40 shadow-2xl text-white select-none">
        {/* Pen Button */}
        <button
          type="button"
          onClick={() => setMode('pen')}
          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            mode === 'pen' ? 'bg-[#22c55e] text-slate-950 font-black' : 'text-emerald-200 hover:bg-white/10'
          }`}
          title="Pen Tool"
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden sm:inline">Pen</span>
        </button>

        {/* Eraser Button */}
        <button
          type="button"
          onClick={() => setMode('eraser')}
          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            mode === 'eraser' ? 'bg-amber-400 text-slate-950 font-black' : 'text-emerald-200 hover:bg-white/10'
          }`}
          title="Eraser Tool"
        >
          <Eraser className="w-4 h-4" />
          <span className="hidden sm:inline">Eraser</span>
        </button>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-1 px-1 border-x border-white/20">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setColor(c.value);
                setMode('pen');
              }}
              className={`w-6 h-6 rounded-full border-2 transition ${
                color === c.value && mode === 'pen' ? 'scale-115 border-white shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={clearCanvas}
          className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 text-xs font-bold flex items-center gap-1"
          title="Clear Entire Canvas"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition ml-1"
          title="Exit Scratchpad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full cursor-crosshair bg-black/15 backdrop-blur-[1px]"
      />
    </div>
  );
};

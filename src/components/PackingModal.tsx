import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Plus, MapPin, Clock, Luggage } from 'lucide-react';
import { PackingItem } from '../types';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface PackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: string) => void;
}

export const PackingModal: React.FC<PackingModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onAddItem,
}) => {
  useModalScrollLock(isOpen);
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  const packedCount = items.filter((i) => i.packed).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
    >
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-matcha-input rounded-3xl shadow-grave border-2 border-slate-300 overflow-hidden flex flex-col overscroll-contain"
        data-lenis-prevent="true"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Luggage className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                Test Bag Packing & Exam Protocol
              </h3>
              <p className="text-xs text-slate-400">
                Scheduled for Thu Nov 5 &bull; Exam Day: Sat Nov 7 @ Crescent Model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crescent Model Test Day Box */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/70">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold text-sm block text-amber-950">
                Exam Center: Crescent Model
              </span>
              <span>
                <strong>Friday Nov 6:</strong> Total Rest. Zero studying. Sleep strictly by <strong>10:00 PM</strong>.<br />
                <strong>Saturday Nov 7:</strong> Wake up at <strong>6:30 AM</strong>. Arrive at Crescent Model before 7:45 AM. Doors close at 8:00 AM sharp!
              </span>
            </div>
          </div>
        </div>

        {/* Packing Checklist Progress */}
        <div className="p-4 bg-matcha-sub border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Packing Readiness:</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {packedCount}/{items.length} Ready
            </span>
          </div>
          {packedCount === items.length && items.length > 0 && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for test day!
            </span>
          )}
        </div>

        {/* List of items */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2.5">
          {items.map((item) => (
            <label
              key={item.id}
              className={`task-check-card calendar-date-neon-hover flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                item.packed ? 'bg-matcha-sub border-slate-200 opacity-70' : 'bg-matcha-input border-[#a6c4a1]/60 shadow-xs'
              }`}
            >
              <span className="task-check-dot mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() => onToggleItem(item.id)}
                  className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
                />
              </span>
              <div className="flex-1 text-xs">
                <span className={`font-semibold ${item.packed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                  {item.item}
                </span>
                {item.required && (
                  <span className="ml-2 text-[10px] font-bold text-rose-600 uppercase">
                    Mandatory
                  </span>
                )}
              </div>
            </label>
          ))}

          {/* Add custom item form */}
          <form onSubmit={handleAdd} className="pt-3 flex gap-2">
            <input
              type="text"
              placeholder="Add custom packing item (e.g. jacket, prescription glasses)..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 text-xs bg-matcha-sub border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-matcha-sub px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-matcha-input border border-slate-200 hover:bg-[rgba(195,218,190,0.65)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

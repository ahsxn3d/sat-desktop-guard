'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface MatchaSelectOption {
  value: string | number;
  label: string;
  badge?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface MatchaSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: MatchaSelectOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  variant?: 'matcha' | 'dark' | 'white';
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
  fullWidth?: boolean;
}

export const MatchaSelect: React.FC<MatchaSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select option...',
  className = '',
  menuClassName = '',
  variant = 'matcha',
  size = 'sm',
  align = 'left',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Determine whether to flip upwards based on viewport space
  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 280px below and more space above, open upwards
      if (spaceBelow < 280 && rect.top > 260) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
      setSearchQuery('');
    }
    setIsOpen(!isOpen);
  };

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && options.length > 6 && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, options.length]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isDark = variant === 'dark';
  const isWhite = variant === 'white';

  const triggerBaseClasses = isDark
    ? 'bg-[#152713] text-[#e8f3e5] border-2 border-[#2d4d28] hover:border-emerald-500 hover:bg-[#1a3318]'
    : isWhite
    ? 'bg-white text-[#122810] border-2 border-[#a6c4a1] hover:border-emerald-600 hover:bg-[#f6fcf5] shadow-xs'
    : 'bg-[#f4faf2] text-[#122810] border-2 border-[#a6c4a1] hover:border-emerald-700 hover:bg-white shadow-xs';

  const sizeClasses = size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-xs sm:text-sm';

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.badge && opt.badge.toLowerCase().includes(q)) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${fullWidth ? 'w-full' : ''}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-xl font-bold font-['JetBrains_Mono'] transition-all duration-150 shadow-xs cursor-pointer select-none active:scale-[0.99] ${triggerBaseClasses} ${sizeClasses} ${className}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-[#264e22] ${
            isDark ? 'text-emerald-400' : 'text-[#264e22]'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: openUpwards ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-[100] ${
              openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } max-h-80 sm:max-h-96 ${
              fullWidth ? 'w-full min-w-full' : 'w-max min-w-[240px] max-w-[420px]'
            } flex flex-col rounded-2xl p-1.5 shadow-grave border-2 backdrop-blur-2xl ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${
              isDark
                ? 'bg-[#0f1f0e]/95 border-[#284824] shadow-black/60 text-slate-100'
                : 'bg-[#f4faf2]/98 border-2 border-[#a6c4a1] shadow-grave text-[#122810]'
            } ${menuClassName}`}
            role="listbox"
          >
            {/* Search Filter Header (when options > 5) */}
            {options.length > 5 && (
              <div className="p-1 pb-1.5 mb-1 border-b border-[#a6c4a1]/40 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#527d4c] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to filter..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs font-medium bg-white/90 border border-[#a6c4a1] text-[#122810] placeholder:text-[#6e8a69] focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6e8a69] hover:text-[#122810] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Items Container (Lenis-Prevented + Visible Scrollbar) */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="overflow-y-auto visible-scrollbar flex-1 pr-1 space-y-0.5"
              style={{ maxHeight: '280px' }}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#527d4c] font-medium">
                  No matching options found.
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = String(option.value) === String(value);

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold font-['JetBrains_Mono'] transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${
                        isSelected
                          ? isDark
                            ? 'bg-emerald-600 text-white font-black shadow-xs'
                            : 'bg-[#1a3717] text-white font-black shadow-xs'
                          : isDark
                          ? 'hover:bg-[#1a3518] text-[#d6ebd1]'
                          : 'hover:bg-[#dcedd9] text-[#122810]'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="truncate">{option.label}</span>
                      </span>

                      <span className="flex items-center gap-1.5 shrink-0">
                        {option.badge && (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : isDark
                                ? 'bg-amber-400/20 text-amber-300'
                                : 'bg-[#e2f0de] text-[#1a3717] border border-[#a6c4a1]'
                            }`}
                          >
                            {option.badge}
                          </span>
                        )}

                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              isDark ? 'text-emerald-200' : 'text-emerald-300'
                            }`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Informative Footer */}
            {options.length > 5 && (
              <div className="pt-1.5 mt-1 border-t border-[#a6c4a1]/30 px-2 flex items-center justify-between text-[10px] font-bold text-[#55814e] font-['JetBrains_Mono'] shrink-0">
                <span>{filteredOptions.length} of {options.length} items</span>
                <span>Scroll to browse</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

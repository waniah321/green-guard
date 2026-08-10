import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function GlassmorphismSelect({ value, onChange, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : value;

  const handleOptionClick = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`glass-select-container ${isOpen ? 'is-open' : ''} ${className}`} ref={containerRef}>
      <button
        type="button"
        className="glass-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`glass-select-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="glass-select-options" role="listbox">
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;
            return (
              <div
                key={optVal}
                role="option"
                aria-selected={isSelected}
                className={`glass-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(optVal)}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

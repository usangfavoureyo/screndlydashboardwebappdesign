import React, { useState, useEffect, useRef } from 'react';

interface ColorPickerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPickerPopup: React.FC<ColorPickerPopupProps> = ({
  isOpen,
  onClose,
  currentColor,
  onColorSelect,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Predefined color palette (optimized for video captions)
  const colorPalette = [
    // Row 1 - Cyans & Blues
    ['#00E5FF', '#00BCD4', '#0288D1', '#1565C0', '#1E88E5'],
    // Row 2 - Light Blue & Oranges/Yellows
    ['#42A5F5', '#FF6D00', '#FF9800', '#FFC107', '#C0B100'],
    // Row 3 - Browns & Reds (with Screndly brand red)
    ['#8D6E63', '#6D4C41', '#ec1e24', '#C62828', '#E91E63'],
    // Row 4 - Pinks & Purples
    ['#F44336', '#EC407A', '#AD1457', '#6A1B9A', '#9C27B0'],
    // Row 5 - Teals & Greens
    ['#BA68C8', '#00796B', '#00897B', '#26A69A', '#43A047'],
    // Row 6 - Lime & Grays/Blacks
    ['#8BC34A', '#76FF03', '#212121', '#546E7A', '#B0BEC5'],
    // Row 7 - Additional Grays & White
    ['#78909C', '#607D8B', '#90A4AE', '#FFFFFF', ''],
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white dark:bg-[#000000] rounded-2xl p-6 w-[340px] border border-gray-200 dark:border-[#333333]"
      >
        {/* Color Grid */}
        <div className="space-y-3 mb-6">
          {colorPalette.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
              {row.map((color, colIndex) => {
                if (!color) return <div key={colIndex} className="w-12 h-12" />;
                
                const isSelected = color.toUpperCase() === currentColor.toUpperCase();
                
                return (
                  <button
                    key={colIndex}
                    onClick={() => {
                      onColorSelect(color);
                      onClose();
                    }}
                    className={`w-12 h-12 rounded-full transition-transform hover:scale-110 border ${
                      color === '#FFFFFF' ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
                    } ${
                      isSelected ? 'ring-4 ring-[#ec1e24] ring-offset-2 dark:ring-offset-[#000000]' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="mb-6">
          <label className="text-gray-900 dark:text-white text-sm mb-2 block">Custom Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorSelect(e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 dark:border-[#333333] cursor-pointer"
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  onColorSelect(value);
                }
              }}
              className="flex-1 px-3 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333333] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#ec1e24] transition-colors uppercase"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-3 text-[#ec1e24] hover:bg-gray-50 dark:hover:bg-[#0A0A0A] rounded-lg transition-colors uppercase tracking-wide"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ColorPickerPopup;
import React, { useEffect, useState } from 'react';
import { useUndo } from './UndoContext';
import { haptics } from '../utils/haptics';

export function UndoToast() {
  const { currentItem, hideUndo } = useUndo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentItem) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [currentItem]);

  if (!currentItem) return null;

  const handleUndo = () => {
    haptics.medium();
    currentItem.onUndo();
    setIsVisible(false);
    setTimeout(() => hideUndo(), 300); // Wait for animation
  };

  return (
    <div 
      className={`fixed bottom-20 left-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="max-w-md mx-auto bg-white dark:bg-[#000000] border border-gray-300 dark:border-[#333333] rounded-lg shadow-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-900 dark:text-white">
          {currentItem.itemName}
        </span>
        <button
          onClick={handleUndo}
          className="ml-4 text-sm font-medium text-[#ec1e24] hover:text-[#d01a20] transition-colors"
        >
          Undo
        </button>
      </div>
    </div>
  );
}

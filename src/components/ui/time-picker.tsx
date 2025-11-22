"use client";

import * as React from "react";
import { Clock } from "lucide-react@0.487.0";
import { cn } from "./utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function TimePicker({
  value = "09:00",
  onChange,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [renderKey, setRenderKey] = React.useState(0);
  
  const hoursRef = React.useRef<HTMLDivElement>(null);
  const minutesRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);

  const isDraggingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Generate hours (1-12)
  const hoursList = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minutes (0-59)
  const minutesList = Array.from({ length: 60 }, (_, i) => i);

  const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

  // Parse the time value (24-hour format) and convert to 12-hour
  const parseTime = (timeValue: string) => {
    const [hours24, minutes24] = timeValue.split(':').map(Number);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 > 12 ? hours24 - 12 : hours24 === 0 ? 12 : hours24;
    return { hours12, minutes24: minutes24 || 0, period };
  };

  const { hours12, minutes24, period } = parseTime(value);
  
  const [selectedHours, setSelectedHours] = React.useState(hours12);
  const [selectedMinutes, setSelectedMinutes] = React.useState(minutes24);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'AM' | 'PM'>(period);

  // Sync state when value prop changes
  React.useEffect(() => {
    const parsed = parseTime(value);
    setSelectedHours(parsed.hours12);
    setSelectedMinutes(parsed.minutes24);
    setSelectedPeriod(parsed.period);
  }, [value]);

  const handleHourChange = (hour: number) => {
    setSelectedHours(hour);
    updateTime(hour, selectedMinutes, selectedPeriod);
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinutes(minute);
    updateTime(selectedHours, minute, selectedPeriod);
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setSelectedPeriod(period);
    updateTime(selectedHours, selectedMinutes, period);
  };

  const updateTime = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    // Convert to 24-hour format
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    const timeString = `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const scrollToCenter = (ref: HTMLDivElement | null, index: number) => {
    if (!ref) return;
    const itemHeight = 44; // Height of each item
    const scrollPosition = index * itemHeight;
    ref.scrollTop = scrollPosition;
  };

  const getCenterIndex = (ref: HTMLDivElement | null) => {
    if (!ref) return 0;
    const itemHeight = 44;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    return index;
  };

  const handleScroll = (
    ref: HTMLDivElement,
    items: (number | 'AM' | 'PM')[],
    setter: (val: any) => void,
    column: 'hours' | 'minutes' | 'period'
  ) => {
    // Update selection in real-time as user scrolls
    const itemHeight = 44;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    
    const selectedValue = items[clampedIndex];
    setter(selectedValue);

    // Snap to position after scrolling stops
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      ref.scrollTop = clampedIndex * itemHeight;
    }, 150);
  };

  React.useEffect(() => {
    const hoursEl = hoursRef.current;
    const minutesEl = minutesRef.current;
    const periodEl = periodRef.current;

    if (!hoursEl || !minutesEl || !periodEl) return;

    const hoursScrollHandler = () => handleScroll(hoursEl, hoursList, setSelectedHours, 'hours');
    const minutesScrollHandler = () => handleScroll(minutesEl, minutesList, setSelectedMinutes, 'minutes');
    const periodScrollHandler = () => handleScroll(periodEl, periods, setSelectedPeriod, 'period');

    hoursEl.addEventListener('scroll', hoursScrollHandler, { passive: true });
    minutesEl.addEventListener('scroll', minutesScrollHandler, { passive: true });
    periodEl.addEventListener('scroll', periodScrollHandler, { passive: true });

    return () => {
      hoursEl.removeEventListener('scroll', hoursScrollHandler);
      minutesEl.removeEventListener('scroll', minutesScrollHandler);
      periodEl.removeEventListener('scroll', periodScrollHandler);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hoursList, minutesList, periods]);

  // Update time whenever any value changes
  React.useEffect(() => {
    if (isOpen) {
      updateTime(selectedHours, selectedMinutes, selectedPeriod);
    }
  }, [selectedHours, selectedMinutes, selectedPeriod, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // First scroll to the correct positions
          scrollToCenter(hoursRef.current, selectedHours - 1);
          scrollToCenter(minutesRef.current, selectedMinutes);
          scrollToCenter(periodRef.current, selectedPeriod === 'AM' ? 0 : 1);
          
          // Force a re-render to update the visual selection
          setTimeout(() => {
            setRenderKey(prev => prev + 1);
          }, 100);
        });
      });
    }
  }, [isOpen, selectedHours, selectedMinutes, selectedPeriod]);

  const formatDisplayTime = () => {
    return `${String(selectedHours).padStart(2, '0')}:${String(selectedMinutes).padStart(2, '0')} ${selectedPeriod}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal !bg-white dark:!bg-[#000000] border-gray-200 dark:border-[#333333]",
            "hover:bg-white dark:hover:bg-[#000000]",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-[#ec1e24]" />
          <span className="text-black dark:text-white">
            {formatDisplayTime()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[250px] p-0 bg-white dark:bg-black backdrop-blur-md border-gray-200 dark:border-white/20 rounded-2xl overflow-hidden" 
        align="start"
        style={{ zIndex: 9999 }}
      >
        <div className="flex relative py-3">
          {/* Selection highlight bar */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] bg-transparent border-t-2 border-b-2 border-black dark:border-white pointer-events-none z-0" />
          
          {/* Hours Column */}
          <div className="flex-1 relative z-10">
            <div 
              ref={hoursRef}
              className="h-[220px] overflow-y-scroll scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="py-[88px]">
                {hoursList.map((hour) => {
                  const isSelected = selectedHours === hour;
                  return (
                    <button
                      key={hour}
                      onClick={() => handleHourChange(hour)}
                      className={cn(
                        "w-full h-[44px] flex items-center justify-center text-lg transition-all duration-200 relative z-10",
                        isSelected
                          ? "text-black dark:text-white font-bold scale-100 opacity-100"
                          : "text-black/30 dark:text-white/30 font-normal opacity-100"
                      )}
                    >
                      {hour}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Minutes Column */}
          <div className="flex-1 relative z-10">
            <div 
              ref={minutesRef}
              className="h-[220px] overflow-y-scroll scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="py-[88px]">
                {minutesList.map((minute) => {
                  const isSelected = selectedMinutes === minute;
                  return (
                    <button
                      key={minute}
                      onClick={() => handleMinuteChange(minute)}
                      className={cn(
                        "w-full h-[44px] flex items-center justify-center text-lg transition-all duration-200 relative z-10",
                        isSelected
                          ? "text-black dark:text-white font-bold scale-100 opacity-100"
                          : "text-black/30 dark:text-white/30 font-normal opacity-100"
                      )}
                    >
                      {String(minute).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Period Column */}
          <div className="flex-1 relative z-10">
            <div 
              ref={periodRef}
              className="h-[220px] overflow-y-scroll scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="py-[88px]">
                {periods.map((period) => {
                  const isSelected = selectedPeriod === period;
                  return (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={cn(
                        "w-full h-[44px] flex items-center justify-center text-lg transition-all duration-200 relative z-10",
                        isSelected
                          ? "text-black dark:text-white font-bold scale-100 opacity-100"
                          : "text-black/30 dark:text-white/30 font-normal opacity-100"
                      )}
                    >
                      {period}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="border-t border-black/10 dark:border-white/10 p-3">
          <Button 
            className="w-full bg-[#ec1e24] hover:bg-[#d11a1f] text-white rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
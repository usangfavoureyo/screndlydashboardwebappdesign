"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react@0.487.0";
import { format } from "date-fns@4.1.0";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { haptics } from "../../utils/haptics";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    haptics.light();
    onDateChange?.(selectedDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          onClick={() => haptics.light()}
          className={cn(
            "w-full justify-start text-left font-normal !bg-white dark:!bg-[#000000] border-gray-200 dark:border-[#333333]",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#ec1e24]" />
          {date ? (
            <span className="text-black dark:text-white">
              {format(date, "EEE dd MMM yyyy")}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
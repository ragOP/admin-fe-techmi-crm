"use client";

import * as React from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const predefinedRanges = {
  "All Time": null,
  "Last Week": {
    from: startOfWeek(addDays(new Date(), -7)),
    to: endOfWeek(addDays(new Date(), -7)),
  },
  "This Month": {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  "This Year": {
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  },
};

const rangeLabels = Object.keys(predefinedRanges).concat("Custom");

export function DateRangePicker({ className, onChange }) {
  const [selectedLabel, setSelectedLabel] = React.useState("All Time");
  const [customRange, setCustomRange] = React.useState();
  const [open, setOpen] = React.useState(false);

  const displayValue = React.useMemo(() => {
    if (selectedLabel === "All Time") return "All Time";
    if (selectedLabel === "Custom" && customRange?.from && customRange?.to)
      return `${format(customRange.from, "LLL dd, y")} - ${format(
        customRange.to,
        "LLL dd, y"
      )}`;
    const range = predefinedRanges[selectedLabel];
    if (range) {
      return `${format(range.from, "LLL dd, y")} - ${format(
        range.to,
        "LLL dd, y"
      )}`;
    }
    return "Pick date range";
  }, [selectedLabel, customRange]);

  React.useEffect(() => {
    if (onChange) {
      if (selectedLabel === "Custom") {
        onChange(customRange || null);
      } else {
        onChange(predefinedRanges[selectedLabel] || null);
      }
    }
  }, [selectedLabel, customRange, onChange]);

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${
              selectedLabel === "All Time" ? "w-[10vw]" : ""
            } justify-between text-left font-normal`}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{displayValue}</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn(
            selectedLabel === "Custom"
              ? "w-fit max-h-[80vh] overflow-auto"
              : "w-[15vw]"
          )}
        >
          <div className="space-y-2">
            {rangeLabels.map((label) => (
              <Button
                key={label}
                variant={selectedLabel === label ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedLabel(label);
                  if (label !== "Custom") setOpen(false);
                }}
              >
                {label}
              </Button>
            ))}
            {selectedLabel === "Custom" && (
              <div className="mt-2 border rounded-md p-2">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={customRange}
                  onSelect={(range) => setCustomRange(range)}
                  initialFocus
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarView } from "@/types";

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onTodayClick: () => void;
  onPrevious: () => void;
  onNext: () => void;
  title: string;
}

export function CalendarHeader({
  view,
  onViewChange,
  onTodayClick,
  onPrevious,
  onNext,
  title,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Calendar className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onTodayClick}>
          Today
        </Button>
        
        <div className="flex items-center rounded-md border">
          <Button variant="ghost" onClick={onPrevious}>
            ←
          </Button>
          <Button variant="ghost" onClick={onNext}>
            →
          </Button>
        </div>

        <Select value={view} onValueChange={(value) => onViewChange(value as CalendarView)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
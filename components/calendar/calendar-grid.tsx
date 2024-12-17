"use client";

import { DayCell } from "@/components/calendar/day-cell";
import { Post } from "@/types";
import { format } from "date-fns";
import { useState } from "react";

interface CalendarGridProps {
  days: Date[];
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export function CalendarGrid({ days, posts, onPostClick }: CalendarGridProps) {
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);

  const getPostsForDay = (date: Date) => {
    return posts.filter(
      (post) =>
        format(new Date(post.scheduledDate), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date) => {
    if (!draggedPost) return;
    // Handle post rescheduling logic here
    setDraggedPost(null);
  };

  return (
    <div className="px-2 py-6">
      <div className="grid grid-cols-7 gap-2 max-w-[1800px] mx-auto">
        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            day={day}
            posts={getPostsForDay(day)}
            onPostClick={onPostClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}

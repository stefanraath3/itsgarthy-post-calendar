"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Post } from "@/types";
import { DayCell } from "@/components/calendar/day-cell";

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
    <div className="grid grid-cols-7 gap-1 p-4">
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
  );
}
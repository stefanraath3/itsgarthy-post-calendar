"use client";

import { PostCard } from "@/components/post/post-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { format, isSameDay } from "date-fns";
import { useEffect, useState } from "react";

interface DayCellProps {
  day: Date;
  posts: Post[];
  onPostClick: (post: Post) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (date: Date) => void;
}

export function DayCell({
  day,
  posts,
  onPostClick,
  onDragOver,
  onDrop,
}: DayCellProps) {
  const [today, setToday] = useState<Date | null>(null);
  const isCurrentMonth = format(day, "MM") === format(new Date(), "MM");

  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <div
      key={day.toISOString()}
      className={cn(
        "h-[280px] p-3 border rounded-lg flex flex-col bg-card transition-colors",
        !isCurrentMonth && "bg-muted/50",
        "hover:border-primary/20"
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(day)}
    >
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex flex-col items-start">
          <span className="text-sm text-muted-foreground font-medium">
            {format(day, "EEE")}
          </span>
          <span
            className={cn(
              "text-xl font-semibold -mt-1 inline-flex items-center justify-center",
              today && isSameDay(day, today)
                ? "text-white bg-primary w-8 h-8 rounded-full"
                : ""
            )}
          >
            {format(day, "d")}
          </span>
        </div>
        {posts.length > 0 && (
          <Badge variant="secondary" className="text-sm px-2 py-0.5">
            {posts.length} post{posts.length !== 1 && "s"}
          </Badge>
        )}
      </div>
      {posts.length > 0 ? (
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="h-[180px]">
                <PostCard post={post} onClick={() => onPostClick(post)} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No posts
        </div>
      )}
    </div>
  );
}

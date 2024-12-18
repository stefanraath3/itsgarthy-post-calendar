"use client";

import { PostCard } from "@/components/post/post-card";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { format, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge"; // Added Badge import

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
  const isCurrentMonth = format(day, "MM") === format(new Date(), "MM");
  
  return (
    <div
      key={day.toISOString()}
      className={cn(
        "min-h-[300px] p-4 border rounded-lg flex flex-col bg-card transition-colors",
        !isCurrentMonth && "bg-muted/50",
        "hover:border-primary/20"
      )}
      style={{ minWidth: '200px' }}
      onDragOver={onDragOver}
      onDrop={() => onDrop(day)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-start">
          <span className="text-base text-muted-foreground font-medium">
            {format(day, "EEE")}
          </span>
          <span
            className={cn(
              "text-2xl font-semibold -mt-1",
              isToday(day) && "text-primary"
            )}
          >
            {format(day, "d")}
          </span>
        </div>
        {posts.length > 0 && (
          <Badge variant="secondary" className="text-base px-3 py-1">
            {posts.length} post{posts.length !== 1 && "s"}
          </Badge>
        )}
      </div>
      <div className="space-y-6 flex-1">
        {posts.map((post) => (
          <div key={post.id} className="h-full">
            <PostCard post={post} onClick={() => onPostClick(post)} />
          </div>
        ))}
      </div>
    </div>
  );
}

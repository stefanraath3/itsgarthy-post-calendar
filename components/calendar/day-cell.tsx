"use client";

import { PostCard } from "@/components/post/post-card";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { format, isToday } from "date-fns";

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
  return (
    <div
      key={day.toISOString()}
      className={cn(
        "min-h-[300px] p-3 border rounded-lg flex flex-col",
        format(day, "MM") !== format(new Date(), "MM") && "bg-muted"
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(day)}
    >
      <div className="font-medium text-sm mb-3 flex flex-col items-start">
        <span className="text-muted-foreground">{format(day, "EEEE")}</span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center text-lg",
              isToday(day) &&
                "bg-primary text-primary-foreground w-8 h-8 rounded-full"
            )}
          >
            {format(day, "d")}
          </span>
        </div>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="h-[200px]">
            <PostCard post={post} onClick={() => onPostClick(post)} />
          </div>
        ))}
      </div>
    </div>
  );
}

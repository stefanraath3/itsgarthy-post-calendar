"use client";

import { PostCard } from "@/components/post/post-card";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { format } from "date-fns";

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
        "min-h-[400px] p-3 border rounded-lg flex flex-col",
        format(day, "MM") !== format(new Date(), "MM") && "bg-muted"
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(day)}
    >
      <div className="font-medium text-sm mb-3 flex flex-col">
        <span className="text-muted-foreground">{format(day, "EEEE")}</span>
        <span className="text-lg">{format(day, "d")}</span>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="h-[300px]">
            <PostCard post={post} onClick={() => onPostClick(post)} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { format } from "date-fns";
import { Post } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: Date;
  posts: Post[];
  onPostClick: (post: Post) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (date: Date) => void;
}

export function DayCell({ day, posts, onPostClick, onDragOver, onDrop }: DayCellProps) {
  return (
    <div
      key={day.toISOString()}
      className={cn(
        "min-h-[150px] p-2 border rounded-lg",
        format(day, "MM") !== format(new Date(), "MM") && "bg-muted"
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(day)}
    >
      <div className="font-medium text-sm mb-2">
        {format(day, "d")}
      </div>
      <div className="space-y-1">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
          />
        ))}
      </div>
    </div>
  );
}
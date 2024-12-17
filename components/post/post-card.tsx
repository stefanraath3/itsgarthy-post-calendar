"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Post } from "@/types";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] h-full flex flex-col overflow-hidden group"
      draggable
      onClick={onClick}
    >
      {post.image_url && (
        <div className="relative w-full aspect-video">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="p-3 flex flex-col gap-2.5 flex-1 bg-card">
        <div className="flex items-center justify-between">
          <Badge
            variant={post.status === "published" ? "default" : "secondary"}
            className="text-xs font-medium"
          >
            {post.platform}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(post.scheduled_date), "h:mm a")}</span>
          </div>
        </div>
        {post.title && (
          <p className="text-sm line-clamp-2 font-medium leading-snug">
            {post.title}
          </p>
        )}
      </div>
    </Card>
  );
}

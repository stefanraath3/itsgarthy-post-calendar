"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow h-full"
      draggable
      onClick={onClick}
    >
      {post.imageUrl && (
        <div className="relative w-full aspect-square">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            caption:
          </span>
          <p className="text-sm">{post.title}</p>
        </div>
        <Badge
          variant={post.status === "published" ? "default" : "secondary"}
          className="w-fit"
        >
          {post.platform}
        </Badge>
      </div>
    </Card>
  );
}

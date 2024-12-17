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
      className="p-2 cursor-pointer hover:shadow-md transition-shadow"
      draggable
      onClick={onClick}
    >
      {post.imageUrl && (
        <div className="relative w-full aspect-video mb-2">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm truncate">{post.title}</span>
        <Badge variant={post.status === "published" ? "default" : "secondary"}>
          {post.platform}
        </Badge>
      </div>
    </Card>
  );
}

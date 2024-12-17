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
      className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      draggable
      onClick={onClick}
    >
      {post.image_url && (
        <div className="relative w-full aspect-square">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-32 object-cover rounded-t-lg"
          />
        </div>
      )}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            caption:
          </span>
          <p className="text-sm truncate max-w-full">{post.title}</p>
        </div>
        <Badge
          variant={post.status === "published" ? "default" : "secondary"}
          className="w-fit mt-2"
        >
          {post.platform}
        </Badge>
      </div>
    </Card>
  );
}

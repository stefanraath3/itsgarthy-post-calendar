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
      className="p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2"
      draggable
      onClick={onClick}
    >
      {post.imageUrl && (
        <div className="relative w-full aspect-square">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed">{post.title}</p>
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

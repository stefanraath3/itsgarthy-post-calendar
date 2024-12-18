"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Post } from "@/types";
import { format } from "date-fns";
import { Clock, Image as ImageIcon } from "lucide-react";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const platformIcons = {
    instagram: "/instagram-icon.svg",
    facebook: "/facebook-icon.svg",
    tiktok: "/tiktok-icon.svg"
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] h-full flex flex-col overflow-hidden group bg-white rounded-lg"
      draggable
      onClick={onClick}
    >
      <div className="p-3 flex items-center justify-between border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={platformIcons[post.platform]}
            alt={post.platform}
            className="w-5 h-5"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {format(new Date(post.scheduled_date), "h:mm a")}
        </span>
      </div>
      
      {post.image_urls?.length > 0 ? (
        <div className="relative flex-1 overflow-hidden bg-muted">
          <img
            src={post.image_urls[0]}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {post.image_urls.length > 1 && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-black/60 text-white"
            >
              +{post.image_urls.length - 1}
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {post.title && (
        <div className="p-3 flex-shrink-0">
          <p className="text-sm text-foreground line-clamp-2">
            {post.title}
          </p>
        </div>
      )}
    </Card>
  );
}

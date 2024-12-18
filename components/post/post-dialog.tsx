"use client";

import { Post } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostForm } from "@/components/post/post-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageCarousel } from "./image-carousel";

interface PostDialogProps {
  post?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Partial<Post>) => void;
  onDelete?: (post: Post) => void;
}

export function PostDialog({ post, open, onOpenChange, onSave, onDelete }: PostDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSave = (data: Partial<Post>) => {
    onSave(data);
    onOpenChange(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(event) => {
          const target = event.target as HTMLInputElement;
          if (target.tagName === 'INPUT' && target.type === 'file') {
            event.preventDefault();
          }
        }}
        onFocusOutside={(event) => {
          const target = event.target as HTMLInputElement;
          if (target.tagName === 'INPUT' && target.type === 'file') {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {post ? (isEditing ? "Edit Post" : "View Post") : "Create Post"}
          </DialogTitle>
        </DialogHeader>

        {isEditing || !post ? (
          <PostForm
            initialData={post}
            onSubmit={handleSave}
            onCancel={handleCancel}
            onDelete={post ? () => onDelete?.(post) : undefined}
          />
        ) : post ? (
          <div className="space-y-6">
            {post.image_urls?.length > 0 && (
              <ImageCarousel
                images={post.image_urls}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            )}
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Caption</h3>
                <p className="mt-1 text-sm text-gray-900">{post.title}</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Post
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete?.(post);
                    onOpenChange(false);
                  }}
                >
                  Delete Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
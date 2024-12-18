"use client";

import { Post } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostForm } from "@/components/post/post-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        {post && !isEditing && post.image_urls?.length > 0 && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
            <img
              src={post.image_urls[currentImageIndex]}
              alt={`Post image ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
            {post.image_urls.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? post.image_urls!.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => (prev === post.image_urls!.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {post.image_urls.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-primary" : "bg-white/80"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {!isEditing && post ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Caption</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.title}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Post
              </Button>
              {onDelete && (
                <Button variant="destructive" onClick={() => onDelete(post)}>
                  Delete Post
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <PostForm
              initialData={post}
              onSubmit={handleSave}
              onCancel={handleCancel}
              onDelete={post && onDelete ? () => onDelete(post) : undefined}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
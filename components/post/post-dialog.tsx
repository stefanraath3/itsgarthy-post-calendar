"use client";

import { Post } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostForm } from "@/components/post/post-form";

interface PostDialogProps {
  post?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Partial<Post>) => void;
  onDelete?: (post: Post) => void;
}

export function PostDialog({ post, open, onOpenChange, onSave, onDelete }: PostDialogProps) {
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
            {post ? "Edit Post" : "Create Post"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <PostForm
            initialData={post}
            onSubmit={(data) => {
              onSave(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
            onDelete={post && onDelete ? () => onDelete(post) : undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
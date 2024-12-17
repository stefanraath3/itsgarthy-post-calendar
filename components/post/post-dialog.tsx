"use client";

import { Post } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostForm } from "@/components/post/post-form";

interface PostDialogProps {
  post?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Partial<Post>) => void;
}

export function PostDialog({ post, open, onOpenChange, onSave }: PostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onInteractOutside={(event) => {
          const target = event.target as HTMLInputElement;
          // Check if the interaction is from a file input
          if (target.tagName === 'INPUT' && target.type === 'file') {
            event.preventDefault();
          }
        }}
        onFocusOutside={(event) => {
          const target = event.target as HTMLInputElement;
          // Check if the focus is moving to a file input
          if (target.tagName === 'INPUT' && target.type === 'file') {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create Post"}</DialogTitle>
        </DialogHeader>
        <PostForm
          initialData={post}
          onSubmit={(data) => {
            onSave(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
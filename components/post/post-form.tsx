"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/lib/hooks/use-user";
import { deleteImage, uploadImage } from "@/lib/supabase/storage";
import { Post } from "@/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: Partial<Post>) => void;
  onCancel: () => void;
}

export function PostForm({ initialData, onSubmit, onCancel }: PostFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<Partial<Post>>(
    initialData || {
      title: "",
      scheduled_date: new Date(),
      platform: "instagram",
      status: "draft",
    }
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image_url || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.id) return;

    const { url, error } = await uploadImage(file, user.id);
    if (error) {
      console.error("Failed to upload image:", error);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFormData({ ...formData, image_url: url || undefined });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      await handleImageUpload(files[0]);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const removeImage = async () => {
    if (formData.image_url) {
      const { error } = await deleteImage(formData.image_url);
      if (error) {
        console.error("Failed to delete image:", error);
        return;
      }
    }

    setPreviewUrl(null);
    setFormData({ ...formData, image_url: undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging ? "border-primary bg-primary/10" : "border-border"
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop an image, or{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                click to upload
              </button>
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        {previewUrl && (
          <div className="relative w-full aspect-square mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg object-cover w-full h-full"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Caption</label>
        <Textarea
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Write a caption for your post..."
          className="min-h-[100px] resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Platform</label>
        <Select
          value={formData.platform}
          onValueChange={(value) =>
            setFormData({ ...formData, platform: value as Post["platform"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Schedule Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.scheduled_date ? (
                format(formData.scheduled_date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.scheduled_date}
              onSelect={(date) =>
                date && setFormData({ ...formData, scheduled_date: date })
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

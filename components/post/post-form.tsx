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
import { format, parse, set } from "date-fns";
import { Calendar as CalendarIcon, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: Partial<Post>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function PostForm({ initialData, onSubmit, onCancel, onDelete }: PostFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<Partial<Post>>(
    initialData || {
      title: "",
      scheduled_date: set(new Date(), { hours: 12, minutes: 0, seconds: 0 }),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Image</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-full">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Drag and drop an image, or{" "}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      click to upload
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Caption</label>
          <Textarea
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Write a caption for your post..."
            className="min-h-[120px] resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Platform</label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value as Post["platform"] })
              }
            >
              <SelectTrigger className="w-full">
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
            <label className="text-sm font-medium text-gray-700">Schedule</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_date ? (
                      format(formData.scheduled_date, "MMM d, yyyy")
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
                      setFormData({
                        ...formData,
                        scheduled_date: date ? set(date, {
                          hours: formData.scheduled_date?.getHours() || 12,
                          minutes: formData.scheduled_date?.getMinutes() || 0,
                          seconds: 0
                        }) : new Date()
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={format(formData.scheduled_date || new Date(), "HH:mm")}
                onValueChange={(time) => {
                  const [hours, minutes] = time.split(":").map(Number);
                  setFormData({
                    ...formData,
                    scheduled_date: set(formData.scheduled_date || new Date(), {
                      hours,
                      minutes,
                      seconds: 0
                    })
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 * 4 }).map((_, i) => {
                    const hours = Math.floor(i / 4);
                    const minutes = (i % 4) * 15;
                    const time = format(set(new Date(), { hours, minutes }), "h:mm a");
                    return (
                      <SelectItem
                        key={i}
                        value={`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}
                      >
                        {time}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
          >
            Delete Post
          </Button>
        )}
        <div className="flex-1" />
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}

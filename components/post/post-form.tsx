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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
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
      image_urls: [],
    }
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.image_urls || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleImageUpload = async (files: FileList) => {
    if (!user?.id) return;

    const newUrls: string[] = [];
    const newPreviewUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { url, error } = await uploadImage(file, user.id);
      if (error) {
        console.error("Failed to upload image:", error);
        continue;
      }
      if (url) {
        newUrls.push(url);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    }

    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    setFormData({ ...formData, image_urls: [...(formData.image_urls || []), ...newUrls] });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      await handleImageUpload(files);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      await handleImageUpload(files);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.image_urls?.[index];
    if (imageUrl) {
      const { error } = await deleteImage(imageUrl);
      if (error) {
        console.error("Failed to delete image:", error);
        return;
      }
    }

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    const newImageUrls = [...(formData.image_urls || [])];
    newImageUrls.splice(index, 1);
    setFormData({ ...formData, image_urls: newImageUrls });

    if (currentImageIndex >= newPreviewUrls.length) {
      setCurrentImageIndex(Math.max(0, newPreviewUrls.length - 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Images</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrls.length === 0 ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-full">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Drag and drop images, or{" "}
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
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <img
                    src={previewUrls[currentImageIndex]}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => removeImage(currentImageIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {previewUrls.length > 1 && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() => setCurrentImageIndex((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                {previewUrls.length > 1 && (
                  <div className="flex justify-center gap-2">
                    {previewUrls.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-primary text-sm font-medium hover:underline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Add more images
                  </button>
                </div>
              </div>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
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
        <Button type="submit" disabled={!formData.image_urls?.length}>
          {initialData ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}

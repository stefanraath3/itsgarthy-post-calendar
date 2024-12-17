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
  const [formData, setFormData] = useState<Partial<Post>>(
    initialData || {
      title: "",
      scheduledDate: new Date(),
      platform: "instagram",
      status: "draft",
    }
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData({ ...formData, imageUrl: undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
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
              {formData.scheduledDate ? (
                format(formData.scheduledDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.scheduledDate}
              onSelect={(date) =>
                date && setFormData({ ...formData, scheduledDate: date })
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

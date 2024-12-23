export interface Post {
  id: string;
  user_id: string;
  title: string;
  image_urls: string[];
  platform: "instagram" | "facebook" | "tiktok";
  scheduled_date: Date;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export type CalendarDay = {
  date: Date;
  posts: Post[];
};

export type CalendarView = "month" | "week" | "day";

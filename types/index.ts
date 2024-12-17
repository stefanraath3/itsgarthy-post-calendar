export interface Post {
  id: string;
  user_id: string;
  title: string;
  image_url?: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin";
  scheduled_date: Date;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
}

export type CalendarDay = {
  date: Date;
  posts: Post[];
};

export type CalendarView = "month" | "week" | "day";

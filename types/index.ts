export type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  scheduledDate: Date;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  userId: string;
};

export type CalendarDay = {
  date: Date;
  posts: Post[];
};

export type CalendarView = 'month' | 'week' | 'day';
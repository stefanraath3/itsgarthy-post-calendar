"use client";

import { useState } from "react";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { PostDialog } from "@/components/post/post-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarView, Post } from "@/types";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from "date-fns";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  
  // Temporary mock data
  const [posts, setPosts] = useState<Post[]>([]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePostSave = (post: Partial<Post>) => {
    if (selectedPost) {
      setPosts(posts.map((p) => (p.id === selectedPost.id ? { ...p, ...post } : p)));
    } else {
      setPosts([
        ...posts,
        {
          ...post,
          id: Math.random().toString(),
          userId: "user1",
        } as Post,
      ]);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <Button onClick={() => {
            setSelectedPost(undefined);
            setIsPostDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <CalendarHeader
          view={view}
          onViewChange={setView}
          onTodayClick={handleToday}
          onPrevious={handlePrevious}
          onNext={handleNext}
          title={format(currentDate, "MMMM yyyy")}
        />

        <CalendarGrid
          days={days}
          posts={posts}
          onPostClick={handlePostClick}
        />

        <PostDialog
          post={selectedPost}
          open={isPostDialogOpen}
          onOpenChange={setIsPostDialogOpen}
          onSave={handlePostSave}
        />
      </div>
    </div>
  );
}
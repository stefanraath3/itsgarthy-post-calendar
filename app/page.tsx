"use client";

import { useState, useEffect } from "react";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { PostDialog } from "@/components/post/post-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CalendarView, Post } from "@/types";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { useUser } from "@/lib/hooks/use-user";
import { createPost, updatePost, getUserPosts, deletePost } from "@/lib/supabase/posts";

export default function Home() {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user?.id) {
      getUserPosts(user.id).then(({ posts, error }) => {
        if (posts) {
          setPosts(posts);
        }
      });
    }
  }, [user?.id]);

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

  const handlePostSave = async (post: Partial<Post>) => {
    if (!user?.id) return;

    if (selectedPost) {
      const { post: updatedPost } = await updatePost({
        ...post,
        id: selectedPost.id,
        user_id: user.id,
      });
      if (updatedPost) {
        setPosts(posts.map((p) => (p.id === selectedPost.id ? updatedPost : p)));
      }
    } else {
      const { post: newPost } = await createPost({
        ...post,
        user_id: user.id,
      });
      if (newPost) {
        setPosts([...posts, newPost]);
      }
    }
  };

  const handlePostDelete = async (post: Post) => {
    if (!user?.id) return;

    const { error } = await deletePost(post.id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== post.id));
      setIsPostDialogOpen(false);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <div className="flex items-center gap-2">
            <SignOutButton />
            <Button 
              onClick={() => {
                setSelectedPost(undefined);
                setIsPostDialogOpen(true);
              }}
              size="sm"
              className="font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
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
          onDelete={selectedPost ? handlePostDelete : undefined}
        />
      </div>
    </div>
  );
}
"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { PostDialog } from "@/components/post/post-dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/use-user";
import {
  createPost,
  deletePost,
  getUserPosts,
  updatePost,
} from "@/lib/supabase/posts";
import { CalendarView, Post } from "@/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user?.id) {
      getUserPosts(user.id).then(({ posts }) => {
        if (posts) setPosts(posts);
      });
    }
  }, [user?.id]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePostSave = async (post: Partial<Post>) => {
    if (!user?.id) return;
    if (selectedPost) {
      const { post: updatedPost } = await updatePost({
        ...post,
        id: selectedPost.id,
        user_id: user.id,
      });
      if (updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === selectedPost.id ? updatedPost : p))
        );
      }
    } else {
      const { post: newPost } = await createPost({ ...post, user_id: user.id });
      if (newPost) {
        setPosts((prev) => [...prev, newPost]);
      }
    }
  };

  const handlePostDelete = async (post: Post) => {
    if (!user?.id) return;
    const { error } = await deletePost(post.id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setIsPostDialogOpen(false);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Calendar</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedPost(undefined);
                setIsPostDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
            <SignOutButton />
          </div>
        </div>

        {/* Calendar Container */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <CalendarHeader
                view={view}
                onViewChange={setView}
                onTodayClick={() => setCurrentDate(new Date())}
                onPrevious={() => setCurrentDate(subMonths(currentDate, 1))}
                onNext={() => setCurrentDate(addMonths(currentDate, 1))}
                title={format(currentDate, "MMMM yyyy")}
              />
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <CalendarGrid
                days={days}
                posts={posts}
                onPostClick={handlePostClick}
              />
            </div>
          </div>
        </div>

        <PostDialog
          post={selectedPost}
          open={isPostDialogOpen}
          onOpenChange={setIsPostDialogOpen}
          onSave={handlePostSave}
          onDelete={selectedPost ? handlePostDelete : undefined}
        />
      </div>
    </main>
  );
}

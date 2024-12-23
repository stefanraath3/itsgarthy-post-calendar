"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
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
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

// 1) Import the new notes helpers & notes sidebar
import { NotesSidebar } from "@/components/notes/notes-sidebar";
import {
  createNote,
  deleteNote,
  getUserNotes,
  updateNote,
} from "@/lib/supabase/notes";
import { Note } from "@/types";

export default function Home() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ========== Calendar State & Effects ==========

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

  const handlePrevious = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

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

  // ========== Notes State & Effects ==========

  const [notes, setNotes] = useState<Note[]>([]);

  // Fetch the user’s notes once the user is available
  useEffect(() => {
    if (user?.id) {
      getUserNotes(user.id).then(({ notes, error }) => {
        if (notes) {
          setNotes(notes);
        }
      });
    }
  }, [user?.id]);

  // Create a new note
  const handleAddNote = async (content: string) => {
    if (!user?.id) return;
    const { note, error } = await createNote(content, user.id);
    if (note) {
      setNotes((prev) => [note, ...prev]);
    }
  };

  // Edit an existing note
  const handleUpdateNote = async (noteId: string, content: string) => {
    const { note, error } = await updateNote(noteId, content);
    if (note) {
      setNotes((prev) => prev.map((n) => (n.id === noteId ? note : n)));
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    const { error } = await deleteNote(noteId);
    if (!error) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Notes Section - Left Side */}
        <div className="w-[45%] h-full border-r bg-[#f5f5f5] flex flex-col">
          <div className="p-4 border-b bg-white">
            <h2 className="text-2xl font-semibold">Notes / Ideas</h2>
          </div>
          <div
            className="flex-1 p-6 overflow-y-auto"
            style={{
              backgroundImage: `repeating-linear-gradient(#f5f5f5 0px, #f5f5f5 24px, #e0e0e0 25px)`,
              backgroundSize: "100% 25px",
            }}
          >
            <NotesSidebar
              notes={notes}
              onAdd={handleAddNote}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
            />
          </div>
        </div>

        {/* Calendar Section - Right Side */}
        <div className="w-[55%] h-full flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-2xl font-bold">
              📅 Welkom by jou Blonsie Calendar 🎉
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setSelectedPost(undefined);
                  setIsPostDialogOpen(true);
                }}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
              <SignOutButton />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <CalendarHeader
                view={view}
                onViewChange={setView}
                onTodayClick={() => setCurrentDate(new Date())}
                onPrevious={handlePrevious}
                onNext={handleNext}
                title={format(currentDate, "MMMM yyyy")}
              />
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="aspect-square p-1 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setCurrentDate(day);
                    // TODO: Add logic to show full calendar view
                  }}
                >
                  <div className="text-sm font-medium">{format(day, "d")}</div>
                  {posts.filter(
                    (post) =>
                      format(new Date(post.scheduled_date), "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd")
                  ).length > 0 && (
                    <div className="mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              ))}
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
      </div>
    </main>
  );
}

"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/use-user";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Import helpers
import { getUserNotes } from "@/lib/supabase/notes";
import { getUserPosts } from "@/lib/supabase/posts";
import { Note, Post } from "@/types";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch initial data
  useEffect(() => {
    if (user?.id) {
      getUserNotes(user.id).then(({ notes }) => {
        if (notes) setNotes(notes);
      });
      getUserPosts(user.id).then(({ posts }) => {
        if (posts) setPosts(posts);
      });
    }
  }, [user?.id]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            📅 Welkom by jou Blonsie Calendar 🎉
          </h1>
          <SignOutButton />
        </div>

        {/* Preview Panes */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Notes Preview */}
          <div
            className="w-[45%] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/notes")}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notes & Ideas</h2>
              <Button variant="ghost" className="gap-2">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 grid gap-4 overflow-y-auto">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    {format(new Date(note.created_at), "MMM d, yyyy")}
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                  <p>No notes yet</p>
                  <Button variant="link" className="mt-2">
                    Create your first note
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Preview */}
          <div
            className="w-[55%] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/calendar")}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Calendar</h2>
              <Button variant="ghost" className="gap-2">
                Open Calendar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="grid grid-cols-7 gap-1 text-sm mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-gray-500 font-medium"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-1 flex-1">
                {Array.from({ length: 35 }).map((_, i) => {
                  const hasPost = posts.some(
                    (post) =>
                      format(new Date(post.scheduled_date), "d") ===
                      String(i + 1)
                  );
                  return (
                    <div
                      key={i}
                      className="aspect-square p-1 text-sm border rounded-md flex flex-col items-center justify-center"
                    >
                      <span className="font-medium">{i + 1}</span>
                      {hasPost && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/lib/hooks/use-user";
import {
  createNote,
  deleteNote,
  getUserNotes,
  updateNote,
} from "@/lib/supabase/notes";
import { Note } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newContent, setNewContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    if (user?.id) {
      getUserNotes(user.id).then(({ notes }) => {
        if (notes) setNotes(notes);
      });
    }
  }, [user?.id]);

  const handleAddNote = async () => {
    if (!user?.id || newContent.trim().length === 0) return;
    const { note } = await createNote(newContent.trim(), user.id);
    if (note) {
      setNotes((prev) => [note, ...prev]);
      setNewContent("");
    }
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    const { note } = await updateNote(noteId, content.trim());
    if (note) {
      setNotes((prev) => prev.map((n) => (n.id === noteId ? note : n)));
      setEditingNoteId(null);
      setEditingContent("");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await deleteNote(noteId);
    if (!error) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Notes & Ideas</h1>
          </div>
          <SignOutButton />
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Notes List */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0">
            <div className="p-4 border-b">
              <div className="flex gap-4">
                <Textarea
                  placeholder="Write a new idea..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="flex-1 resize-none"
                  rows={1}
                />
                <Button onClick={handleAddNote} className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" /> Add Note
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 rounded-lg border p-4 hover:shadow-sm transition-shadow group"
                  >
                    {editingNoteId === note.id ? (
                      <>
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="mb-2 min-h-[100px]"
                          placeholder="Write your note..."
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateNote(note.id, editingContent)
                            }
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingContent("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-400">
                          <span>
                            {format(new Date(note.created_at), "MMM d, yyyy")}
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingContent(note.content);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

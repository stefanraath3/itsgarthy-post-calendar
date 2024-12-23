"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface NotesSidebarProps {
  notes: Note[];
  onAdd: (content: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NotesSidebar({
  notes,
  onAdd,
  onUpdate,
  onDelete,
}: NotesSidebarProps) {
  const [newContent, setNewContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleAddNote = () => {
    if (newContent.trim().length === 0) return;
    onAdd(newContent.trim());
    setNewContent("");
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleEditSave = () => {
    if (!editingNoteId) return;
    onUpdate(editingNoteId, editingContent.trim());
    setEditingNoteId(null);
    setEditingContent("");
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Textarea
          placeholder="Write a new idea..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 text-lg leading-[25px] resize-none"
          style={{
            backgroundImage: "none",
          }}
        />
        <Button onClick={handleAddNote} className="w-full mt-2">
          Add Note
        </Button>
      </div>

      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="relative group">
            {editingNoteId === note.id ? (
              <>
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 text-lg leading-[25px] resize-none"
                  style={{
                    backgroundImage: "none",
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleEditSave} size="sm">
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
                <p className="text-lg whitespace-pre-wrap leading-[25px]">
                  {note.content}
                </p>
                <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(note)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => onDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

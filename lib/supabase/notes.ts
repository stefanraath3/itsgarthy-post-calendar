import { Note } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function getUserNotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { notes: data as Note[], error: null };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { notes: null, error };
  }
}

export async function createNote(content: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ user_id: userId, content }])
      .select()
      .single();

    if (error) throw error;
    return { note: data as Note, error: null };
  } catch (error) {
    console.error("Error creating note:", error);
    return { note: null, error };
  }
}

export async function updateNote(noteId: string, content: string) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .update({ content })
      .eq("id", noteId)
      .select()
      .single();

    if (error) throw error;
    return { note: data as Note, error: null };
  } catch (error) {
    console.error("Error updating note:", error);
    return { note: null, error };
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { error };
  }
}

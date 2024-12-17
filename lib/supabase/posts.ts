import { Post } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function createPost(post: Partial<Post>) {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return { post: null, error };
  }

  return { post: data as Post, error: null };
}

export async function updatePost(post: Partial<Post>) {
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return { post: null, error };
  }

  return { post: data as Post, error: null };
}

export async function getUserPosts(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: true });

  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: null, error };
  }

  return { posts: data as Post[], error: null };
}

export async function deletePost(postId: string) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting post:", error);
    return { error };
  }

  return { error: null };
}

import { Post } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

// Helper function to ensure backward compatibility during migration
function normalizePost(post: any): Post {
  return {
    ...post,
    // Handle both old image_url and new image_urls format
    image_urls: post.image_urls || (post.image_url ? [post.image_url] : []),
  };
}

export async function createPost(post: Partial<Post>) {
  const postData = {
    ...post,
    image_urls: post.image_urls || [],
  };

  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return { post: null, error };
  }

  return { post: normalizePost(data), error: null };
}

export async function updatePost(post: Partial<Post>) {
  const postData = {
    ...post,
    image_urls: post.image_urls || [],
  };

  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", post.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return { post: null, error };
  }

  return { post: normalizePost(data), error: null };
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

  // Normalize all posts to use image_urls
  const posts = data.map(normalizePost);

  return { posts, error: null };
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

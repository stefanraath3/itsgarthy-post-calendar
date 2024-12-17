import { Post } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function uploadImage(file: File, userId: string, postId?: string) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = postId
      ? `${userId}/${postId}.${fileExt}`
      : `${userId}/${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error };
  }
}

export async function deleteImage(imagePath: string) {
  try {
    const fileName = imagePath.split("post-images/")[1];
    const { error } = await supabase.storage
      .from("post-images")
      .remove([fileName]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error };
  }
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

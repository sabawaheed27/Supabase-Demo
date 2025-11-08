"use server";

import { postSchema } from "./schema"; 
import { uploadImage } from "@/utils/uploadImage";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server-client";

export default async function CreatePost(formData: FormData) {
  let slug: string | undefined;

  try {
    const supabase = await createClient();

    // 1. Make sure user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "User not authenticated. Please log in to create a post." };
    }

    // 2. Validate form data safely
    const rawData = {
      title: formData.get("title"),
      content: formData.get("content"),
      image: formData.get("image"),
    };

    const validatedFields = postSchema.safeParse(rawData);
    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error.flatten());
      return { error: "Invalid data. Please check your inputs." };
    }
    const { data: parsedData } = validatedFields;

    // 3. Upload image if it exists (with better error handling)
    let imageUrl: string | null = null;  //  Changed to null instead of undefined
    
    if (parsedData.image && parsedData.image.size > 0) {  //  Check file size
      try {
        imageUrl = await uploadImage(parsedData.image);
        console.log('✅ Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error(' Image upload failed:', uploadError);
        // Continue without image instead of failing the entire post
        imageUrl = null;
      }
    } else {
      console.log('ℹ No image provided - creating post without image');
    }

    // 4. Generate a slug
    slug = slugify(parsedData.title);

    console.log('Creating post with:', {
      title: parsedData.title,
      content: parsedData.content,
      slug,
      image_url: imageUrl,
      user_id: user.id
    });

    // 5. Insert post into the database
    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        slug,
        title: parsedData.title,
        content: parsedData.content,
        image_url: imageUrl,  
      })
      .select('slug')
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return { error: "Could not save the post to the database: " + insertError.message };
    }

    console.log(' Post created successfully:', newPost);

  } catch (e) {
    const err = e as Error;
    console.error(" An unexpected error occurred:", err.message);
    return { error: "An unexpected error occurred. Please try again." };
  }

  // 6. Revalidate paths and redirect on success
  revalidatePath("/");
  if (slug) {
    redirect(`/${slug}`);
  } else {
    redirect('/');
  }
}
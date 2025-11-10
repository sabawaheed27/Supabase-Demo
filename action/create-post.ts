"use server";

import { postSchema } from "./schema"; 
import { uploadImage } from "@/utils/uploadImage";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server-client";

export default async function CreatePost(formData: FormData) {
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

    // 2. Get form data
    const title = formData.get("title");
    const content = formData.get("content");
    const imageFile = formData.get("image") as File | null;

    console.log(" Form data received:", {
      title,
      content,
      image: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'No image'
    });

    // 3. Prepare data for validation
    //  Handle empty file properly - don't include it if it's empty
    const rawData: any = {
      title,
      content,
    };

    // Only include image if it's a real file with content
    if (imageFile && imageFile.size > 0 && imageFile.name !== '') {
      rawData.image = imageFile;
    }

    console.log(" Data for validation:", 
      {
      title: rawData.title,
      content: rawData.content,
      hasImage: !!rawData.image
    });

    // 4. Validate
    const validatedFields = postSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
      console.error(" Validation failed:", validatedFields.error.flatten());
      console.error(" Full error:", JSON.stringify(validatedFields.error, null, 2));
      return { error: "Invalid data. Please check your inputs." };
    }
    
    const { data: parsedData } = validatedFields;
    // console.log(" Validation passed");

    // 5. Upload image if it exists
    let imageUrl: string | null = null;
    
    if (parsedData.image && parsedData.image.size > 0) {
      try {
        // console.log(" Uploading image...");
        imageUrl = await uploadImage(parsedData.image);
        // console.log(" Image uploaded:", imageUrl);
      } catch (uploadError) {
        // console.error(" Image upload failed:", uploadError);
        imageUrl = null;
      }
    } else {
      console.log("ℹ No image to upload");
    }

    // 6. Generate a slug
    const slug = slugify(parsedData.title);
    // console.log(" Slug generated:", slug);

    // 7. Insert post into the database
    const postData = {
      user_id: user.id,
      slug,
      title: parsedData.title,
      content: parsedData.content,
      image_url: imageUrl,
    };

    // console.log(" Inserting post:", postData);

    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert(postData)
      .select('id, slug, title')
      .single();

    if (insertError) {
      console.error(" Database insert error:", insertError);
      return { error: "Could not save the post to the database: " + insertError.message };
    }

    // console.log(" Post created successfully:", newPost);

    // 8. Revalidate the home page cache
    revalidatePath("/");
    revalidatePath(`/${slug}`);

    // Return success (let client handle redirect)
    return { 
      success: true, 
      slug: newPost.slug,
      message: "Post created successfully!" 
    };

  } catch (e) {
    const err = e as Error;
    // console.error(" Unexpected error:", err.message);
    // console.error(" Stack:", err.stack);
    return { error: "An unexpected error occurred: " + err.message };
  }
}
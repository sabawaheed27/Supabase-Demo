"use server";


import { Database } from "@/utils/supabase/database.type";
import { postSchema } from "./schema"; 
import { uploadImage } from "@/utils/uploadImage";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server-client";

export default async function CreatePost(formData: FormData) {
  let slug: string;

  try {
    const supabase = await createClient();

    // 1. Make sure user is logged in
    const {data: { user },error: authError,} = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "User not authenticated. Please log in." };
    }

    // 2. Validate form data safely
    const image = formData.get("image");
    const rawData = {
      title: formData.get("title"),
      content: formData.get("content"),
      // Only include the image if it's a file with size > 0
      image: image instanceof File && image.size > 0 ? image : undefined,
    };

    const validatedFields = postSchema.safeParse(rawData);
    if (!validatedFields.success) {
      // The Zod error messages are complex, so we'll send a generic one.
      // The client-side validation will show the specific field errors.
      console.error("Zod validation error:", validatedFields.error.flatten());
      return { error: "Invalid data provided. Please check the form." };
    }
    const { data: parsedData } = validatedFields;

    // 3. Upload image if it exists
    let imageUrl: string | undefined = undefined;
    if (parsedData.image && parsedData.image.size > 0) {
      imageUrl = await uploadImage(parsedData.image);
    }

    // 4. Generate a slug
    slug = slugify(parsedData.title);

    // 5. Insert post into the database and wait for it to finish
    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.id,
      slug,
      title: parsedData.title,
      content: parsedData.content,
      image_url: imageUrl,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return { error: "Failed to create the post in the database." };
    }
  } catch (e) {
    const err = e as Error;
    console.error("Create post error:", err.message);
    return { error: "An unexpected error occurred. Please try again." };
  }

  // 6. Revalidate paths and redirect on success
  revalidatePath("/");
  // Redirect to the newly created post's page
  redirect(`/${slug}`);
}

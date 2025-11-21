'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from 'next/cache';
import { uploadImage } from "@/utils/uploadImage";

export async function editPost(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "You must be logged in to edit posts." };
    }

    // Get form data
    const postId = parseInt(formData.get('postId') as string);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const slug = formData.get('slug') as string;
    const removeImage = formData.get('removeImage') === 'true';
    const imageFile = formData.get('image') as File | null;

    // Verify user owns this post
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id, image_url')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return { success: false, error: "Post not found." };
    }

    if (post.user_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this post." };
    }

    // Handle image logic
    let newImageUrl: string | null = post.image_url;

    if (removeImage) {
      // User wants to remove the image
      if (post.image_url) {
        try {
          const { error: deleteError } = await supabase.storage
            .from('images')  
            .remove([post.image_url]);
          
          if (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      newImageUrl = null;
    } else if (imageFile && imageFile.size > 0) {
      // User is uploading a new image
      
      // Delete the old image if it exists
      if (post.image_url) {
        try {
          const { error: deleteError } = await supabase.storage
            .from('images')  
            .remove([post.image_url]);
          
          if (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Upload new image using the same function as create-post
      try {
        console.log(' Uploading new image...');
        newImageUrl = await uploadImage(imageFile);
        console.log(' Image uploaded:', newImageUrl);
      } catch (uploadError: any) {
        console.error(' Error uploading new image:', uploadError);
        return { success: false, error: "Failed to upload image: " + uploadError.message };
      }
    }

    // Update the post
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        content,
        slug,
        image_url: newImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Error updating post:", updateError);
      return { success: false, error: "Failed to update the post." };
    }

    console.log(' Post updated successfully');

    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/${slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in editPost:", error);
    return { success: false, error: "An unexpected error occurred: " + error.message };
  }
}
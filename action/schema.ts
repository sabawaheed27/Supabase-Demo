import {z} from 'zod'

export const logInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long")
})
export const signUpSchema = z.object({
    email: z.email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(3, "Content must be at least 3 characters"),
     image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        //  Allow undefined, null, or empty file
        if (!file) return true;
        if (file.size === 0) return true;
        // Only validate size if file exists and has content
        return file.size <= 5_000_000;
      },
      "Max file size is 5MB"
    )
    .refine(
      (file) => {
        //  Allow undefined, null, or empty file
        if (!file) return true;
        if (file.size === 0) return true;
        // Only validate type if file exists and has content
        return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      },
      "Image must be .jpg, .png, or .webp"
    ),
});
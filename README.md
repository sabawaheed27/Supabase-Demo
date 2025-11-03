 The Quad: A Full-Stack Next.js & Supabase Application

This project is a full-stack web application built with the Next.js App Router and Supabase. It functions as a simple social platform or blog where users can create posts, and other users can comment on them.

# Features Implemented

You have successfully implemented a wide range of features, covering authentication, data management, and user interaction.

1. User Authentication
- User Login & Registration: A complete authentication flow allowing users to sign up and log in.
- Session Management: The application header dynamically changes to greet logged-in users by their username and provides a "Logout" button.
- Protected Actions:All critical actions (creating, editing, deleting content) are protected and can only be performed by authenticated users.


 2. Post Management (CRUD)
- Create Posts: Users can create new posts with a title, content, and an optional image.
- Read Posts:
  - A homepage that lists all posts.
  - A dedicated page for viewing a single post in detail.
- Update Posts: Authors of a post have the ability to edit its content.
- Delete Posts: Authors can delete their own posts.
- Search: A search bar in the header allows users to find posts by title.


 3. Comment System (CRUD)
- Create Comments: Logged-in users can add comments to any post.
- Read Comments: All comments are displayed below the post content, showing the author's username.
- Update Comments: Comment authors can edit their own comments directly on the page. The UI seamlessly switches to an editing view.
- Delete Comments: Comment authors can delete their own comments.


 4. Security & Data Integrity
- Ownership Checks: All `update` and `delete` operations (for both posts and comments) are performed using Next.js Server Actions that securely verify that the logged-in user is the author of the content before making any changes to the database.
- Input Validation: Server actions include checks to prevent empty content from being submitted.

5. User Experience
- Interactive UI: The comment section is built with Client Components to manage state for editing, providing a smooth user experience without a full page reload.
- Toast Notifications: The application uses `sonner` to provide clear feedback to the user when actions like updating a comment succeed or fail.

Tech Stack

- Framework: Next.js (App Router)
- Backend & Database: Supabase
- Language:TypeScript
- tyling: Tailwind CSS
- UI Notifications: Sonner

How It Works: Key Architecture:

- Server Components (`/app`): Most pages and data-display components (like `page.tsx` and `CommentList.tsx`) are React Server Components, which fetch data directly on the server for fast and secure rendering.

- Client Components (`'use client'`): Interactive pieces of the UI, like `CommentItem.tsx` (for handling edit state) and `CommentForm.tsx`, are Client Components.

- Server Actions (`/action`): All database mutations (create, update, delete) are handled by Server Actions. This allows you to call secure, server-side code directly from client components without creating separate API routes.

- Data Fetching (`/utils/supabase/queries.ts`): All Supabase queries are organized into a dedicated file, making the data-fetching logic reusable and easy to manage.

# Next.js Blog Application

A full-featured blog application built with Next.js, NextAuth.js, Prisma, and Tailwind CSS. The application includes authentication, role-based authorization, rich text editing, and more.

Prerequisites

- Noxt.js: Version 13 or higher
- MySQL: A running MySQL database instance
- Cloudinary Account: For image uploads 
- npm: Node package manager
- GitHub OAuth App: For GitHub login
- Google OAuth App: For Google login


Features
- Authentication with Google, GitHub, and email/password
- Role-based authorization (Admin, Editor, User)
- Admin dashboard for managing users and posts
- Image upload with Cloudinary integration
- Blog post management (create, read, update, delete)
- Comments and likes functionality

Technologies Used
- Middleware(App Router)
- NextAuth.js for authentication
- Prisma ORM with MySQL
- Tailwind CSS for styling
- Cloudinary for image storage


API Endpoints
1. POST /api/posts
    Create a new blog post (includes image upload via Cloudinary).
    Access: Requires ADMIN or EDITOR role.
    Response: JSON object of the created post or { error: "Unauthorized" } (401).
2. GET /api/posts
    Retrieve published posts, optionally filtered by category or tag.
    Response: JSON array of posts with author and tags.
3. POST /api/posts/[postId]/like
    Like a post.
    Access: Requires authentication.
    Response: Redirects to the post page (handled client-side).
4. POST /api/posts/[postId]/save
    Save a post.
    Access: Requires authentication.
    Response: Redirects to the post page (handled client-side).
5. POST /api/posts/[postId]/comment
    Add a comment to a post.
    Access: Requires authentication.
    Response: Redirects to the post page (handled client-side).


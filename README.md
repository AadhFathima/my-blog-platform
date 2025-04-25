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


Database Overview
1. User Model
Represents platform users with authentication capabilities
Fields: id, name, email, role, password, timestamps
Relationships:
One-to-many with Post (author relationship)
One-to-many with Comment
One-to-many with Like
One-to-many with SavedPost
Roles: ADMIN, EDITOR, READER (enum)

2. Post Model
Represents blog posts/articles
Fields: id, title, content, slug (unique), optional image, tags (JSON), category, timestamps, published status
Relationships:
Many-to-one with User (author)
One-to-many with Comment
One-to-many with Like
One-to-many with SavedPost

3. Comment Model
Represents user comments on posts
Fields: id, content, timestamps
Relationships:
Many-to-one with User (author)
Many-to-one with Post

4. Like Model
Represents user likes on posts
Fields: id, timestamp
Relationships:
Many-to-one with User
Many-to-one with Post
Unique constraint: A user can like a post only once (user_id + post_id unique combination)

5. SavedPost Model
Represents posts saved by users for later reading
Fields: id, timestamp
Relationships:
Many-to-one with User
Many-to-one with Post
Unique constraint: A user can save a post only once (user_id + post_id unique combination)

##Getiing Started 
Run npm run dev for the development server.
Ensure the database is running and environment variables are set.


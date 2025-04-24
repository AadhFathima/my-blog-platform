import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/[...nextauth]/route";
import { Prisma, Post, Comment, Like, SavedPost, User } from "@prisma/client"; // Import Prisma types

// Define types for relations
type PostWithRelations = Post & {
  author: User;
  comments: (Comment & { author: User })[];
  likes: Like[];
  saved: SavedPost[];
};

export async function generateStaticParams() {
  const posts: Post[] = await prisma.post.findMany({ where: { published: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const post: PostWithRelations | null = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      comments: { include: { author: true } },
      likes: true,
      saved: true,
    },
  });

  if (!post) {
    notFound();
  }

  const isLiked = session
    ? post.likes.some((like) => like.userId === parseInt(session.user.id))
    : false;
  const isSaved = session
    ? post.saved.some((saved) => saved.userId === parseInt(session.user.id))
    : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto mb-4 rounded-lg"
        />
      )}
      <div className="prose dark:prose-invert mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By {post.author.name ?? "N/A"} | {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Category: {post.category} | Tags: {post.tags.join(", ")}
        </p>
        {session && (
          <div className="flex gap-4 mt-2">
            <form action={`/api/posts/${post.id}/like`} method="POST">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isLiked ? "bg-blue-800" : "bg-blue-600"
                } text-white hover:bg-blue-700`}
              >
                Like ({post.likes.length})
              </button>
            </form>
            <form action={`/api/posts/${post.id}/save`} method="POST">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isSaved ? "bg-gray-800" : "bg-gray-600"
                } text-white hover:bg-gray-700`}
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {post.comments.map((comment) => (
          <div key={comment.id} className="border-t py-4">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By {comment.author.name ?? "N/A"}
            </p>
          </div>
        ))}
        {session && (
          <form action={`/api/posts/${post.id}/comment`} method="POST" className="mt-4">
            <textarea
              name="content"
              placeholder="Add a comment..."
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
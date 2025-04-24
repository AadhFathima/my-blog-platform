import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tags = formData.get("tags") as string;
  const image = formData.get("image") as File;

  let imageUrl: string | undefined;
  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader.upload_stream({ folder: "blog" }, (error, result) => {
        resolve(result);
      }).end(buffer);
    });
    imageUrl = (uploadResult as any).secure_url;
  }

  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      image: imageUrl,
      authorId: parseInt(session.user.id),
      published: session.user.role === "ADMIN",
    },
  });

  return NextResponse.json(post);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      category: category || undefined,
      tags: tag ? { has: tag } : undefined,
    },
    include: { author: true },
  });

  return NextResponse.json(posts);
}
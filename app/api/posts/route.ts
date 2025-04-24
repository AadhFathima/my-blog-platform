import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../(auth)/[...nextauth]/route";
import { uploadImage } from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const slug = formData.get("slug") as string;
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim());
  const category = formData.get("category") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | undefined;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      image: imageUrl,
      tags,
      category,
      authorId: Number(session.user.id),
    },
  });

  return NextResponse.json(post, { status: 201 });
}
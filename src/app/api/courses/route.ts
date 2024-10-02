import { getUser } from "@/components/hooks/getUser";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getUser();
    const userId = user.id;
    const { title } = await req.json();
    if (!user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.create({
      data: {
        userId,
        title,
      }
    })
    return NextResponse.json(course);
  } catch (err) {
    console.log("[Courses]", err)
    return new NextResponse("Internal error", { status: 500 });
  }
}   
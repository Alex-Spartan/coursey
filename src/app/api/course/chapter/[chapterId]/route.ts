import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { chapterId: string } }) {
    const { chapterId } = params;
    const { getUser } = getKindeServerSession();
    const data = await req.json();

    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    try {
        const courseOwner = await db.course.findUnique({
            where: {
                id: data.courseId,
            },
        });

        if (!courseOwner) {
            return NextResponse.json({ error: "Course does not exists for the user" }, { status: 400 });
        }

        const updatedChapter = await db.chapter.update({
            where: { id: chapterId },
            data: {
                ...data,
            },
        });

        return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
        console.error("Error updating chapter:", error);
        return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { chapterId: string } }) {
    const { chapterId } = params;
    const {getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
            },
        });

        if (!chapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        await db.chapter.delete({
            where: {
                id: chapterId,
            },
        });

        return NextResponse.json({ message: "Chapter Deleted" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting chapter:", error);
        return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 });
    }
}
import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.id || !body.title) {
        return NextResponse.json({ error: "id, title doesn't exists" }, { status: 400 })
    }
    const courseOwner = await db.course.findUnique({
        where: {
            id: body.id,
        },
    });

    if (!courseOwner) {
        return NextResponse.json({ error: "Course does not exists for the user" }, { status: 400 });
    }
    const lastChapter = await db.chapter.findFirst({
        where: {
            courseId: body.id,
        },
        orderBy: {
            id: "desc",
        },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
        data: {
            title: body.title,
            courseId: body.id,
            position: newPosition,
        }
    });
    if (!chapter) {
        return NextResponse.json({ error: "Error creating chapter" }, { status: 401 });
    }

    return NextResponse.json({ message: "Chapter created successfully" }, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { courseId, chapterList } = await req.json();
    if (!courseId) {
        return NextResponse.json({ error: "courseId doesn't exists" }, { status: 400 })
    }
    const courseOwner = await db.course.findUnique({
        where: {
            id: courseId,
        },
    });

    if (!courseOwner) {
        return NextResponse.json({ error: "Course does not exists for the user" }, { status: 400 });
    }

    for (const item of chapterList) {
        const updateChapter = await db.chapter.update({
            where: {
                id: item.id,
            },
            data: {
                position: item.position,
            }
        });
        if (!updateChapter) {
            return NextResponse.json({ error: "Error updating chapter id: " + item.id }, { status: 401 });
        }
    }


    return NextResponse.json({ message: "Chapter updated successfully" }, { status: 201 });
}
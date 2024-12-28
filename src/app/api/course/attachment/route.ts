import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.id || !body.name || !body.url ) {
        return NextResponse.json({error: "id, name, url doesn't exists"}, { status: 400})
    }
    const courseOwner = await db.course.findUnique({
        where: {
            id: body.id,
        },
    });

    if (!courseOwner) {
        return NextResponse.json({ error: "Course does not exists for the user" }, { status: 400 });
    }
    const attachment = await db.attachment.create({
        data: {
            name: body.name,
            url: body.url,
            courseId: body.id,
        }
    });
    if (!attachment) {
        return NextResponse.json({ error: "Error creating attachment" }, { status: 401 });
    }

    return NextResponse.json({ message: "Attachment created successfully" }, { status: 201});
}

export async function DELETE(req: Request) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const attachment = await db.attachment.delete({
        where: {
            id: body.attachmentId,
        }
    });
    if (!attachment) {
        return NextResponse.json({ error: "Error deleting attachment" }, { status: 401 });
    }

    return NextResponse.json({ message: "Attachment deleted successfully" }, { status: 201});
}
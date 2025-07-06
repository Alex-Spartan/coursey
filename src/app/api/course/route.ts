import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
    const { title, userId } = await req.json();

    const course = await db.course.create({
        data: {
            title,
            userId,
        }
    });

    return Response.json(course);
}


export async function PATCH(req: Request) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const course = await db.course.update({
        where: {
            id: body.id,
        },
        data: {
            ...body,
        }
    });
    if (!course) {
        return Response.json({ error: "Course not found" }, { status: 404 });
    }

    return Response.json({ message: "Course updated successfully" });
}

export async function DELETE(req: Request) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const course = await db.course.findUnique({
        where: {
            id: body.id,
        },
        include: {
            chapters: true,
        }
    });
    if (!course) {
        return Response.json({ error: "Course not found" }, { status: 404 });
    }

    const deletedChapters =await db.chapter.deleteMany({
        where: {
            courseId: course.id,
        }
    });
    if (!deletedChapters) {
        return Response.json({ error: "An error occurred while deleting chapters" }, { status: 500 });
    }

    const deletedCourse =await db.course.delete({
        where: {
            id: course.id,
        }
    });
    if (!deletedCourse) {
        return Response.json({ error: "An error occurred while deleting course" }, { status: 500 });
    }

    return Response.json({ message: "Course deleted successfully" });
}
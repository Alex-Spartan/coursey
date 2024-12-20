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
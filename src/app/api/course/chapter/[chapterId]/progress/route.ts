import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    const { chapterId, isCompleted} = await req.json();
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId: user.id,
                    chapterId: chapterId
                }
            },
            update: {
                isCompleted,
            },
            create: {
                userId: user.id,
                chapterId,
                isCompleted
            }
        })

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
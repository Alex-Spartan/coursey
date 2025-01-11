import { db } from "@/lib/prisma";
import Mux from "@mux/mux-node";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_SECRET_KEY,
})

export async function PATCH(req: NextRequest, { params }: { params: { chapterId: string } }) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { chapterId } = params;
    const data = await req.json();

    try {
        const courseOwner = await db.course.findUnique({
            where: {
                id: data.courseId,
            },
        });

        if (!courseOwner) {
            return NextResponse.json({ error: "Course does not exists for the user" }, { status: 400 });
        }

        if (data.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                })
            }
            
            const asset = await video.assets.create({
                input: data.videoUrl,
                playback_policy: "public",
                test: false,
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId,
                    playbackId: asset.playback_ids?.[0].id,
                },
            })
        }


        const updatedChapter = await db.chapter.update({
            where: { id: chapterId },
            data,
        });

        return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
        console.error("Error updating chapter:", error);
        return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 });
    }
}
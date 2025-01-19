import { db } from "@/lib/prisma";

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        })

        const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                isCompleted: true,
                chapterId: {
                    in: publishedChapterIds,
                },
            }
        })

        const progress = (validCompletedChapters / publishedChapters.length) * 100;
        return progress;
    } catch (error) {
        console.error(error);
        return 0;
    }
}
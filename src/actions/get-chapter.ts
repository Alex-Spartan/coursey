import { db } from "@/lib/prisma";
import { Attachment, Chapter } from "@prisma/client";

interface getChapterProps {
    userId?: string | null;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: getChapterProps) => {
    try {
        let purchase = null;
        if (userId) {
            purchase = await db.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId: userId,
                        courseId: courseId
                    }
                }
            })
        }

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
            }
        })

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            }
        })

        if (!chapter || !course) {
            throw new Error("Chapter or Course not found");
        }

        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            });
        }

        if (chapter.isFree || purchase) {
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        let userProgress = null;
        if (userId) {
             userProgress = await db.userProgress.findFirst({
                where: {
                    userId: userId,
                    chapterId: chapterId,
                }
            })
        }

        return {
            chapter,
            course,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }

    } catch (error) {
        console.log("error", error);
        return {
            chapter: null,
            course: null,
            attachments: [],
            nextChapter: null,
            purchase: null,
        }
    }
}
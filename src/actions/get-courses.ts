import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/prisma";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    id: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({ id, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                title: {
                    contains: title,
                },
                categoryId: categoryId ? categoryId : undefined,
                isPublished: true,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchase: {
                    where: {
                        userId: id,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchase.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(id, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                }
        })
    );

        return coursesWithProgress;
    } catch (error) {
        console.error(error);
        return [];
    }
}
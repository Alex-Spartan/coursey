import { Category, Course } from "@prisma/client";
import { db } from "@/lib/prisma";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    id?: string;
    title?: string;
    categoryId?: string;
};

// Fetch all published courses (optionally filtered by title/category)
export const getAllCourses = async ({ title, categoryId }: Omit<GetCourses, "id">): Promise<CourseWithProgressWithCategory[]> => {
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
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // No progress for all courses
        return courses.map(course => ({
            ...course,
            progress: null,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

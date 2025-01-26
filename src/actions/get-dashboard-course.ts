import { db } from "@/lib/prisma";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category  | null;
    chapters: Chapter[];
    progress: number | null;
};

type DashBoardCourse = {
    completedCourses: any[];
    coursesInProgress: any[];
};

export const getDashBoardCourses = async (userId: string): Promise<DashBoardCourse> => {
    try {
        const purchaseCourses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        },
                    },
                },
            },
        });

        const courses = purchaseCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (const course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        }

    } catch (error) {
        console.log("DashBoard error ", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }
}
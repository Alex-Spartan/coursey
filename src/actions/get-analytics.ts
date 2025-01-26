import { db } from "@/lib/prisma";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
}

const groupByCourse = (purchase: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchase.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) grouped[courseTitle] = 0;

        grouped[courseTitle] += purchase.course.price! || 0;
    });

    return grouped;
}

export const getAnalytics = async (userId: string) => {
    try {

        const purchases = await db.purchase.findMany({
            where: {
                userId,
            },
            include: {
                course: true,
            },
        });   
        const groupedEarning = groupByCourse(purchases);
        const data = Object.entries(groupedEarning).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((total, item) => total + item.total, 0);


        return {
            data,
            totalRevenue,
            totalSales: purchases.length
        }
    } catch (error) {
        console.log(error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0
        }
    }
}
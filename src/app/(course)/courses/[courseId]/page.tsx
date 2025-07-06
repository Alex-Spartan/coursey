import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };k
}) => {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();
  // if (!user) return redirect("/api/auth/login");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/api/auth/login");

  return  redirect(`/courses/${params.courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;

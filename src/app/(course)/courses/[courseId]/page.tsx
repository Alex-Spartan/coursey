import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/search");

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

  if (!course) return redirect("/search");

  return  redirect(`/courses/${params.courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;

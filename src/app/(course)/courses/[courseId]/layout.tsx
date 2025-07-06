import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: user ? { where: { userId: user.id } } : false, // Don't include if user is not logged in
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/api/auth/login");

  let progressCount = null;
  if (user) progressCount = await getProgress(user.id, course.id);

  return (
    <div className="h-full">
      <div className="h-[89px] md:pl-64 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className=" hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-64 pt-[90px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;

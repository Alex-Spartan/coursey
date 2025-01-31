import { getDashBoardCourses } from "@/actions/get-dashboard-course";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CourseItem from "../search/_components/course-item";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/api/auth/login");

  const { coursesInProgress, completedCourses } = await getDashBoardCourses(user.id);
  

  return (
    <div className="p-6 space-y-4">
      {user ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InfoCard
                icon={Clock}
                label="In Progress"
                numberOfItems={coursesInProgress.length}
              />
            </div>
            <div>
              <InfoCard
                icon={CheckCircle}
                label="Completed"
                numberOfItems={completedCourses.length}
                variant="success"
              />
            </div>
          </div>
          <CourseItem courses={[...completedCourses, ...coursesInProgress]} />
        </>
      ) : (
        <Link href={`/search`} className="text-center text-slate-500 font-semibold text-xl">Start browsing</Link>
      )}
    </div>
  );
};
export default page;

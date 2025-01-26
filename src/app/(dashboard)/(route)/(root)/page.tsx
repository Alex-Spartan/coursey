import { getDashBoardCourses } from "@/actions/get-dashboard-course";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import CourseItem from "../search/_components/course-item";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";

const page = async () => {

const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  const { 
    completedCourses,
    coursesInProgress
  } = await getDashBoardCourses(user.id);

  return (
  <div className="p-6 space-y-4">
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
  </div>
  );
};
export default page;

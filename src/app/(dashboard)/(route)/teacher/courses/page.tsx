import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { db } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CoursePage = async () => {
  const { getUser } =  getKindeServerSession();
  const user = await getUser();
  const data = await db.course.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    }
  })
  

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  );
};
export default CoursePage;

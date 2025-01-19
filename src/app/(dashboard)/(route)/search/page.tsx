import { db } from "@/lib/prisma"
import Categories from "./_components/categories"
import SearchInput from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import CourseItem from "./_components/course-item"

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const page = async ({
  searchParams
} : SearchPageProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");

  const category = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  const courses = await getCourses({id: user.id, ...searchParams});

  return (
    <>
    <div className="px-6 pt-6 md:hidden md:mb-0 block">
      <SearchInput />
    </div>
    <div className="p-6 space-y-4">
      <Categories categories={category} />
    </div>
    <div className="p-6">
      <CourseItem courses={courses} />
    </div>
    </>
  )
}
export default page
import { db } from "@/lib/prisma";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getAllCourses } from "@/actions/get-courses";
import CourseItem from "./_components/course-item";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const page = async ({ searchParams }: SearchPageProps) => {
 const courses = await getAllCourses({...searchParams });


  const category = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });



  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Categories categories={category} />
      </div>
      <div className="p-6">
        <div>{}</div>
        <CourseItem courses={courses} />
      </div>
    </>
  );
};
export default page;

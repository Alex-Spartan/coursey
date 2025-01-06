import { IconBadge } from "@/app/(dashboard)/_components/icon-badge";
import { db } from "@/lib/prisma";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapter-form";

const page = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  const category = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });


  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.imgUrl,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const completionText = `${filledFields}/${totalFields} done`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span>Complete all fields {completionText}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={category.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <h2 className="text-xl">Course content</h2>
          </div>
          <div>
            <ChapterForm initialData={course} courseId={course.id} />
          </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign} />
            <h2 className="text-xl">Pricing</h2>
          </div>
          <PriceForm initialData={course} courseId={course.id} />
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">Resources and Attachments</h2>
          </div>
          <AttachmentForm initialData={course} courseId={course.id} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default page;

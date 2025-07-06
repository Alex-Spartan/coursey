import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReactPlayer from "react-player";
import CourseEnrollButton from "../../_components/enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseProgressButton from "../../_components/course-progress-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId: user ? user.id : null,
      courseId: params.courseId,
      chapterId: params.chapterId,
    });

  if (!chapter && !course) return redirect("/api/auth/login");

  const isLocked = !chapter.isFree && !purchase;
  // const isCompleteOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to view this chapter"
        />
      )}
      <div className="flex items-center gap-2 p-4">
        <Link href={`/search`} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4" />
        Back to course page
        </Link>
      </div>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-semibold p-4">{chapter.title}</h2>
        {chapter.videoUrl ? (
          <ReactPlayer
            src={chapter.videoUrl}
            controls
            style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center aspect-video">
            <span className="text-slate-500">No video available</span>
          </div>
        )}
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
                courseId={params.courseId}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-2">Attachments</h2>
                <ul>
                  {attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                      >
                        {attachment.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;

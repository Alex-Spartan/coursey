import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "../../_components/video-player";
import CourseEnrollButton from "../../_components/enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseProgressButton from "../../_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/search");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: user.id,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter && !course) return redirect("/search");

  const isLocked = !chapter.isFree && !purchase;
  const isCompleteOnEnd = !!purchase && !userProgress?.isCompleted;

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
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={isCompleteOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
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
            {
              attachments.length > 0 && (
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
              )
            }
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;

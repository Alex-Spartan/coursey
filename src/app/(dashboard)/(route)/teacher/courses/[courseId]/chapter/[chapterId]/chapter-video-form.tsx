/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import { PlayCircle, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "@/components/file-upload";

import { Chapter, MuxData } from "@prisma/client";

type ChapterVideoFormProps = {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "videoUrl is required",
  }),
});


const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });


  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values: z.infer<typeof formSchema>) => {
    toggleEdit();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/chapter/${chapterId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...values, courseId}),
      });
      const chapter = await response.json();
      if (!response.ok) {
        toast.error(chapter.error);
        return;
      }
      toast.success("Chapter updated successfully");
      router.refresh();
    } catch {
      toast.error("An error occurred");
    }
  };


  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add Video
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
          !initialData.videoUrl ? (
            <div className="flex items-center justify-center aspect-video mt-2">
              <PlayCircle className="h-12 w-12 text-slate-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
            </div>
          )
      ) : (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
            />
        </div>
      )}
      <div className="text-sm italic text-slate-500">Uploading and processing video may take time. If video doesn&apos;t appear try refresing page</div>
    </div>
  );
};

export default ChapterVideoForm;

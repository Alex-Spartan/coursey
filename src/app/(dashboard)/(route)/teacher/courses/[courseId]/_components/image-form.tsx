"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

type ImageForm = {
  initialData: Course;
  courseId: string;
};

const formSchema = z.object({
  imgUrl: z.string().min(1, {
    message: "imgUrl is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageForm) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values: z.infer<typeof formSchema>
  ) => {
    toggleEdit();
    try {
      const response = await fetch(`/api/course`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id: courseId }),
      });
      const course = await response.json();
      if (!response.ok) {
        toast.error(course.error);
        return;
      }
      toast.success("Course updated successfully");
      router.refresh();
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course imgUrl
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircleIcon className="h-4 w-4" />
              Edit imgUrl
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
          !initialData.imgUrl ? (
            <div className="flex items-center justify-center aspect-video mt-2">
              <ImageIcon className="h-12 w-12 text-slate-500" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60">
              <Image src={initialData.imgUrl} alt="image" width={400} height={400} className="aspect-video rounded-md"  />
            </div>
          )
      ) : (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imgUrl: url });
              }
            }}
            />
        </div>
      )}
    </div>
  );
};

export default ImageForm;

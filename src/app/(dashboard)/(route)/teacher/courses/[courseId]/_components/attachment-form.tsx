/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

type AttachmentFormProps = {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
};

const formSchema = z.object({
  url: z.string().min(1, {
    message: "url is required",
  }),
  name: z.string().min(1, {
    message: "name is required",
  }),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values: z.infer<typeof formSchema>
  ) => {
    toggleEdit();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/attachment`, {
        method: "POST",
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

  const deleteFile = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/attachment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId, attachmentId: id }),
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
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircleIcon className="h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          ) : (
            <div>
              {initialData.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id ? (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button className="ml-auto hover:opacity-75 transition" onClick={() => deleteFile(attachment.id)}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url && name) {
                onSubmit({ url: url, name: name });
              }
            }}
          />
          <div className="">Add resources for you students</div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;

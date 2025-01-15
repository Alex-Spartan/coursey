"use client";

import { AlertDialogBox } from "@/components/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type CourseActionProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

const CourseAction = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionProps) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/course`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const chapter = await response.json();
      if (!response.ok) {
        toast.error(chapter.error);
        return;
      }
      toast.success(chapter.message);
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error("An error occurred");
    }
  };
  const publish = async () => {
    try {
      const response = await fetch(`/api/course`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !isPublished, id: courseId }),
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
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled} variant="outline" onClick={publish}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertDialogBox onConfirm={onDelete}>
        <Button
          variant="destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogBox>
    </div>
  );
};

export default CourseAction;

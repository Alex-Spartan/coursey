"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Icon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/chapter/${chapterId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId,
          isCompleted: !isCompleted,
        }),
      });
      
      setIsLoading(false);

      if (!isCompleted && nextChapterId) {
          router.push(`/course/chapter/${nextChapterId}`);
      }

      if (!response.ok) {
        toast.error("Failed to update course progress");
      }
      toast.success("Progress Updated!")
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button onClick={onClick} disabled={isLoading} type="button" variant={isCompleted ? "outline" : "success"}>
      {isCompleted ? "Completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;

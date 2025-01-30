"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import ChapterList from "./chapter-list";
import { useRouter } from "next/navigation";

type ChapterFormProps = {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
};

const formSchema = z.object({
  title: z.string().min(1),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [IsCreating, setIsCreating] = useState(false);
  const [IsUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.chapters[0]?.title,
    },
  });
  console.log("chapters ",initialData.chapters);

  const { isValid, isSubmitting } = form.formState;

  const toggleCreate = () => setIsCreating(!IsCreating);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values: z.infer<typeof formSchema>
  ) => {
    toggleCreate();
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/course/chapter`, {
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
      setIsUpdating(false);
      toast.success("Chapter added successfully");
      router.refresh();
    } catch {
      toast.error("An error occurred");
    }
  };

  const onReorder = async (updateData: { id: string; position: number}[]) => {
    try {
      const response = await fetch(`/api/course/chapter`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapterList: updateData, courseId }),
      });
      const course = await response.json();
      if (!response.ok) {
        toast.error(course.error);
        return;
      }
      toast.success("Chapter reorder successfully");
      router.refresh();
    } catch {
      toast.error("An error occurred");
    }
  }
  
  const onEdit = async (chapterId: string) => {
    setIsUpdating(true);
    router.push(`/teacher/courses/${courseId}/chapter/${chapterId}`);
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {
        IsUpdating && (
          <div className="absolute h-32 w-32 bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-black" />
          </div>
        )
      }
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant="ghost" onClick={toggleCreate}>
          {IsCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add chapter
            </>
          )}
        </Button>
      </div>
      {IsCreating ? (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={!IsCreating}
                      placeholder="Introduction"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-4">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div>
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.chapters[0]?.title && "text-slate-500"
            )}
          >
            {
              initialData.chapters.length == 0 ? ( <div>
                No chapters added yet
              </div> ) : (
                <ChapterList key={initialData.chapters.length} onEdit={onEdit} onReorder={onReorder} items={initialData.chapters || []} />
              )
            }
          </div>
          {!IsCreating && initialData.chapters.length > 0 && (
            <div className="text-slate-500 italic text-sm mt-2">
              Move Chapters to change the order
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterForm;

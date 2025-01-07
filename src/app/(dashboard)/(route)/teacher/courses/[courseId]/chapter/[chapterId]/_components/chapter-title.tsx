"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";

type ChapterTitleFormProps = {
  initialData: {
    title: string | null;
  };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});


const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values: z.infer<typeof formSchema>) => {
    toggleEdit();
    try {
      const response = await fetch(`/api/course/chapter/${chapterId}`, {
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
        Course title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
          <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      disabled={!isEditing}
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
        <div className=" text-sm mt-2">{initialData.title}</div>
      )}
    </div>
  );
};

export default ChapterTitleForm;

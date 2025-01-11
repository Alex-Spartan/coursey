"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

type ChapterAccessFormProps = {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  isFree: z.boolean().default(false),
});


const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        isFree: !!initialData.isFree,
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
        Chapter Access
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Change Access
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
          <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                        Check this box if you want this chapter to be free for preview
                    </FormDescription>
                  </div>
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
        <div className=" text-sm mt-2">
            {!!initialData.isFree ? "Free for preview" : "Not free for preview"}
        </div>
      )}
    </div>
  );
};

export default ChapterAccessForm;

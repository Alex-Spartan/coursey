"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type DescriptionFormProps = {
  initialData: {
    description: string | null;
  };
  courseId: string;
};

const formSchema = z.object({
  description: z.string().min(1, {
    message: "description is required",
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        description: initialData.description || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

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
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button variant="ghost" onClick={toggleEdit}>
          {!isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>{initialData.description || "No Description"}</div>
      ) : (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea  disabled={isEditing} {...field} />
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
      )}
    </div>
  );
};

export default DescriptionForm;

"use client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";

type CategoryFormProps = {
  initialData: {
    categoryId: string | null;
  };
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
};

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || "",
    },
  });
  const { isSubmitting } = form.formState;

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
        Course category
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Combobox field={field} options={options} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className={cn("mt-2", !initialData.categoryId && "italic text-slate-500")} >{options.find(option => option.value === initialData.categoryId)?.label || "No category"}</div>
      )}
    </div>
  );
};

export default CategoryForm;

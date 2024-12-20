"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type TitleFormProps = {
  initialData: {
    title: string;
  };
  courseId: string;
};

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/course`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
        Course title
        <Button
          variant="ghost"
          onClick={toggleEdit}
          disabled={!isValid || isSubmitting}
        >
          {!isEditing ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          ) : (
            <>Cancel</>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div className=" text-sm mt-2">{initialData.title}</div>
      ) : (
        <div>Use Form here</div>
      )}
    </div>
  );
};

export default TitleForm;

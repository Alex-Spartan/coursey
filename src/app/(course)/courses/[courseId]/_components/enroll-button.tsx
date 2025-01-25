"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const CourseEnrollButton = ({
    courseId,
    price
}: {
    courseId: string;
    price: number
}) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
        setIsLoading(true);
        const response = await fetch(`/api/course/checkout`, {
          method: "POST",
          body: JSON.stringify({ courseId }),
        })
        if (!response.ok) {
            throw new Error("Failed to fetch checkout session");
        }

        const data = await response.json();
        router.replace(data.url);
    } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }
    
  return (
    <Button className="w-full md:w-auto" onClick={onClick} disabled={isLoading}>Enroll for ${price}</Button>
  )
}

export default CourseEnrollButton
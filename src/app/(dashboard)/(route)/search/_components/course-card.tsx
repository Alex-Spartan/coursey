import CourseProgress from '@/app/(course)/courses/[courseId]/_components/course-progress';
import { IconBadge } from '@/app/(dashboard)/_components/icon-badge';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CourseCardProps {
    id: string;
    title: string;
    imgUrl: string;
    chaptersLength: number;
    price: number;
    progress: number;
    category: string;
};

const CourseCard = ({
    id,
    title,
    imgUrl,
    chaptersLength,
    price,
    progress,
    category
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <Image
            fill
            className='object-cover'
            alt={title}
            src={imgUrl}
          />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground'>
            {category}
          </p>
          <div className='my-3 flex items-center gap-x-2 text-sm'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              value={progress}
              size="sm"
            />
          ) : (
            <p className='test-md md:test-sm font-medium text-slate-700'>
              {price === 0 ? "Free" : `$${price}`}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
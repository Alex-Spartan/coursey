"use client";
import { cn } from '@/lib/utils'
import queryString from 'query-string';

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { IconType } from 'react-icons/lib'

interface CategoryItemProps {
    label: string
    value?: string
    Icon?: IconType
}

const CategoryItem = ({
    label,
    value,
    Icon
} : CategoryItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const serachParams = useSearchParams();

    const currentCategoryId = serachParams.get('categoryId');
    const currentTitle = serachParams.get('title');

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipEmptyString: true, skipNull: true });
        // console.log(url)
        router.push(url);
    }

  return (
    <button
        className={cn('flex items-center p-y-2 px-3 text-sm border border-slate-200 gap-x-1 hover:border-sky-700 rounded-full', 
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
        )}
        onClick={onClick}
    >
        {Icon && <Icon size={20} />}
        <div className='truncate'>
            {label}
        </div>
    </button>
  )
}

export default CategoryItem
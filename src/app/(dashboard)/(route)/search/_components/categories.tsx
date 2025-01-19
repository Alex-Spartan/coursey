"use client";
import { Category } from '@prisma/client'
import {
  FcMusic,
  FcOldTimeCamera,
  FcSportsMode,
  FcSalesPerformance,
  FcFilmReel,
  FcEngineering,
  FcMultipleDevices,
} from 'react-icons/fc'
import React from 'react'
import { IconType } from 'react-icons/lib'
import CategoryItem from './category-item'

interface CategoriesProps {
  categories: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Engineering": FcEngineering,
  "Filming": FcFilmReel,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
};

const Categories = ({ categories }: CategoriesProps) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {
        categories.map((category) => (
          <CategoryItem key={category.id} value={category.id} label={category.name} Icon={iconMap[category.name]} />
        ))
      }
    </div>
  )
}

export default Categories
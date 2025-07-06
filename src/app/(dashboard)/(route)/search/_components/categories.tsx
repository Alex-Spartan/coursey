"use client";
import { Category } from '@prisma/client'
import {
  FcSportsMode,
  FcEngineering,
  FcMultipleDevices,
  FcBusiness,
  FcBullish,
  FcMindMap,
  FcElectronics,
  FcIdea,
} from 'react-icons/fc'
import { IconType } from 'react-icons/lib'
import CategoryItem from './category-item'

interface CategoriesProps {
  categories: Category[]
}


const iconMap: Record<Category['name'], IconType> = {
  "Economics": FcBullish,
  "Bussiness": FcBusiness,
  "Fitness": FcSportsMode,
  "Engineering": FcEngineering,
  "Computer science": FcMultipleDevices,
  "Artifical intelligence": FcMindMap,
  "Electronics": FcElectronics,
  "Life lessons": FcIdea,
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
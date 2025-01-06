'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableItemProps {
  id: string
  children: React.ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 p-3 rounded flex items-center space-x-2"
      {...attributes}
    >
      <span {...listeners} className="touch-none cursor-move">
        <GripVertical className="text-gray-400" size={20} />
      </span>
      <span className='flex justify-between items-center w-full'>{children}</span>
    </li>
  )
}
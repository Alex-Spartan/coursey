"use client";

import React, { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { Chapter } from "@prisma/client";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: {id: string, position: number}[] ) => void;
  items: Chapter[];
}

const ChapterList = ({ onEdit, onReorder, items }: ChapterListProps) => {
  const [chapters, setChapters] = useState<Chapter[]>(items);
  console.log("items", items);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setChapters((chapters) => {
        const oldIndex = chapters.findIndex((item) => item.id === active.id);
        const newIndex = chapters.findIndex((item) => item.id === over?.id);

        const updatedChapters = arrayMove(chapters, oldIndex, newIndex);

        const bulkUpdateData = updatedChapters.map((chapter, index) => ({
          id: chapter.id,
          position: index + 1,
        }));

        onReorder(bulkUpdateData);
        return updatedChapters;
      });
    }
  }, [onReorder]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow">
        <SortableContext
          items={chapters.map((item: Chapter) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {chapters.map((item: Chapter) => (
              <SortableItem key={item.id} id={item.id}>
                <div>{item.title}</div>
                <div className="flex items-center justify-center gap-3">
                  <Badge>{item.isPublished ? "Published" : "Draft"}</Badge>
                  <Pencil onClick={() => onEdit(item.id)} className="text-gray-400" size={20} />
                </div>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default ChapterList;

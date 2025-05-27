import {  useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SortableItem = ({ id, banner, index, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`transition-all duration-200 border-l-4 ${
        banner.type === "new" ? "border-l-green-500" : "border-l-blue-500"
      }`}
    >
      <CardContent >
        <div className="flex items-center gap-3">
          {/* <div className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600" >
            <GripVertical className="h-5 w-5" />
          </div> */}

          <div className="flex-1">
            <div className="text-base font-medium">Banner {index + 1}</div>
            <div className="text-sm text-gray-500 truncate">
              {(banner?.name || "").slice(0, 10)} •{" "}
              {banner.type === "new" ? "New upload" : "Existing"}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
                console.log("button clicked");
              console.log("Delete banner", id, index);
              onDelete(banner._id, index)
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SortableItem;
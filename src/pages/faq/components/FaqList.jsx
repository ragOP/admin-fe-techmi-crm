import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaq } from "../helpers/getFaq";
import { deleteFaq } from "../helpers/deleteFaq";
import { useEffect, useState } from "react";
import FaqForm from "./FaqForm";
import { Skeleton } from "@/components/ui/skeleton";
import FaqCard from "./FaqCard";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderFaq } from "../helpers/reorderFaq";

const FaqList = () => {
  const queryClient = useQueryClient();
  const [faq, setFaqs] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["faq"],
    queryFn: getFaq,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: (res) => {
      toast.success(res?.message || "FAQ deleted successfully.");
      queryClient.invalidateQueries(["faq"]);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderFaq,
    onSuccess: () => queryClient.invalidateQueries(["faq"]),
  });

  useEffect(() => {
    if (data) {
      const sortedFaqs = data.sort((a, b) => a.order - b.order);
      setFaqs(sortedFaqs);
    }
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = faq.findIndex((item) => item._id === active.id);
    const newIndex = faq.findIndex((item) => item._id === over.id);
    const updated = arrayMove(faq, oldIndex, newIndex).map((item, index) => ({
    ...item,
    order: index,
  }));

    setFaqs(updated);
    reorderMutation.mutate(updated);
  };

  return (
    <div className="flex flex-col overflow-x-auto p-4 space-y-4">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={faq.map((item) => item._id)} strategy={verticalListSortingStrategy}>
            {faq.map((faqItem, index) => (
              <FaqCard
                key={faqItem._id}
                faq={faqItem}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
      <FaqForm isEdit={false} height={200} disableMinHeight />
    </div>
  );
};

export default FaqList;

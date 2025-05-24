import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTermsCondition } from "../helpers/getTermsCondition";
import { updateTermsConditions } from "../helpers/updateTermsCondition";
import { deleteTermsCondition } from "../helpers/deleteTermsCondition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import TermsConditionForm from "./TermsConditionForm";
import { Skeleton } from "@/components/ui/skeleton";

const ItemType = "TERM";

const TermCard = ({ term, index, moveCard, onDelete }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="min-w-[300px] mr-4">
      <Card className="px-6 py-4 shadow-md flex flex-row justify-between">
        <div className="flex justify-center items-center cursor-move text-muted-foreground">
          <GripVertical size={16} />
        </div>
        <div
          onClick={() => console.log("Open in editor function")}
          className="w-full flex justify-start cursor-pointer"
        >
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: term.title }}
          />
        </div>
        <div className="flex justify-center items-center ">
          <Button
            variant="destructive"
            size="sm"
            className=""
            onClick={() => onDelete(term._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

const TermsConditionList = () => {
  const queryClient = useQueryClient();
  const [terms, setTerms] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["terms"],
    queryFn: getTermsCondition,
  });

  // const deleteMutation = useMutation({
  //   mutationFn: deleteTermsCondition,
  //   onSuccess: (res) => {
  //     queryClient.invalidateQueries(["terms"]);
  //     toast.success(res);
  //   },
  // });

  // const reorderMutation = useMutation({
  //   mutationFn: updateTermsConditions,
  //   onSuccess: () => queryClient.invalidateQueries(["terms"]),
  // });

  // const moveCard = (fromIndex, toIndex) => {
  //   const updated = [...terms];
  //   const [moved] = updated.splice(fromIndex, 1);
  //   updated.splice(toIndex, 0, moved);
  //   setTerms(updated);

  //   reorderMutation.mutate(updated.map((t, i) => ({ id: t.id, order: i })));
  // };

  // const handleDelete = (id) => {
  //   deleteMutation.mutate(id);
  // };

  useEffect(() => {
    if (data?.terms_and_conditions) {
      setIsEdit(true);
      setTerms({
        terms_and_conditions: data?.terms_and_conditions,
      });
    }
  }, [data]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <div className="flex flex-col overflow-x-auto p-4 space-y-4">
        {isLoading && <Skeleton className="w-40 h-40" />}
        {terms.map((term, index) => (
          <TermCard
            key={term._id}
            term={term}
            index={index}
            moveCard={moveCard}
            onDelete={handleDelete}
          />
        ))}
      </div> */}
      {/* <div className="px-4">
        <TermsConditionForm
          isEdit={isEdit}
          initialData={terms.terms_and_conditions}
         />
      </div> */}
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : terms ? (
        <div className="px-4">
          <TermsConditionForm id={data?._id} isEdit={isEdit} initialData={terms} />
        </div>
      ) : (
        <div className="px-4">
          <TermsConditionForm />
        </div>
      )}
    </DndProvider>
  );
};

export default TermsConditionList;

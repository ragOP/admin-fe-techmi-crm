import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FaqForm from "./FaqForm";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const FaqCard = ({ faq, index, onDelete }) => {
  const [open, setOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} >
      <Card className="px-6 py-4 shadow-md flex flex-row justify-between items-center space-x-2">
        <div className="cursor-move text-muted-foreground" {...listeners}>
          <GripVertical size={16} />
        </div>
        <div className="w-full">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
             <div className="prose cursor-pointer">
              <div className="text-base font-semibold">
                {faq.question}
              </div>
               <div
                className="text-base text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />

             </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Faq</DialogTitle>
                <DialogDescription>
                  Make changes to your faq here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <FaqForm id={faq._id} isEdit={true} initialData={faq} disableMinHeight height={250} 
              closeDialog={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Button variant="destructive" size="sm" onClick={() => onDelete(faq._id)}>
          <Trash2 size={16} />
        </Button>
      </Card>
    </div>
  );
};

export default FaqCard;

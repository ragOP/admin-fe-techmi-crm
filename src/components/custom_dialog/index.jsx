import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CustomDialog({
  onOpen,
  onClose,
  title,
  buttonText,
  modalType,
  onDelete,
  id
}) {
  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalType}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {title}? <br /> This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onDelete(id)}
            variant={modalType === "Delete" ? "destructive" : "primary"}
            type="submit"
          >
            {modalType ? modalType : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

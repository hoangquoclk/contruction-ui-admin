import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Dispatch, SetStateAction } from "react"

type TModalDeleteConfirmProps = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  onDelete: () => void
}

export const ModalDeleteConfirm = ({
  open,
  onOpenChange,
  onDelete,
}: TModalDeleteConfirmProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xoá blog</DialogTitle>
          <DialogDescription className="text-red-500">
            Bạn có chắc sẽ xoá bài viết này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type={"button"}
            variant={"secondary"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant={"destructive"} onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

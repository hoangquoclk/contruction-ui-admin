import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Trash2 } from "lucide-react"
import type { TCategoryResponse } from "@/types/category.type.ts"
import { useDeleteCategory } from "@/hooks/category.ts"
import { toast } from "sonner"

type TActionProsp = {
  category: TCategoryResponse
}

export const DeleteCategoryBtn = ({ category }: TActionProsp) => {
  const { mutateAsync: deleteCategory } = useDeleteCategory()

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
    } catch (error) {
      toast.error("Failed to delete category. Please try again.")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          title="Xóa danh mục"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa danh mục "{category.name}"? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => handleDelete(category.id)}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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
import { Eye, EyeOff } from "lucide-react"
import type { TCategoryResponse } from "@/types/category.type.ts"
import { usePublishCategory } from "@/hooks/category.ts"

type TActionProsp = {
  category: TCategoryResponse
}

export const PublishCategoryBtn = ({ category }: TActionProsp) => {
  const { mutateAsync: publishCategory } = usePublishCategory()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title={category.published ? "Ẩn danh mục" : "Xuất bản danh mục"}
        >
          {category.published ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Xác nhận ${category.published ? "ẩn danh mục" : "xuất bản danh mục"}`}</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn{" "}
            {category.published ? "ẩn danh mục" : "xuất bản danh mục"} "
            {category.name}
            "? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() =>
              publishCategory({
                id: category.id,
                payload: { published: !category.published },
              })
            }
          >
            {category.published ? "Ẩn danh mục" : "Xuất bản danh mục"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

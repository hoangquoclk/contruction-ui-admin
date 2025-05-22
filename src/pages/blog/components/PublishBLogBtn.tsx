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
import type { TPostResponse } from "@/types/post.type.ts"
import { usePublishedPost } from "@/hooks/post.ts"

type TActionProsp = {
  post: TPostResponse
}

export const PublishBlogBtn = ({ post }: TActionProsp) => {
  const { mutateAsync: publishPost } = usePublishedPost()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title={post.published ? "Ẩn bài viết" : "Xuất bản bài viết"}
        >
          {post.published ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Xác nhận ${post.published ? "ẩn bài viết" : "xuất bản bài viết"}`}</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn{" "}
            {post.published ? "ẩn bài viết" : "xuất bản bài viết"} "{post.title}
            "? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() =>
              publishPost({
                id: post.id,
                payload: { published: !post.published },
              })
            }
          >
            {post.published ? "Ẩn bài viết" : "Xuất bản bài viết"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

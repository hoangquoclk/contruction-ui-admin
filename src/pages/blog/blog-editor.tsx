import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FormValues } from "@/pages/blog/FormValues"

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/blogs")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h1>
      </div>

      <FormValues />
    </div>
  )
}

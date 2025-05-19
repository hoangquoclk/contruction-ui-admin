import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, EyeOff, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { useDeletePost, useGetPosts, usePublishedPost } from "@/hooks/post.ts"
import { get } from "lodash"
import { ModalDeleteConfirm } from "@/pages/blog/ModalDeleteConfirm"
import { Action } from "@/pages/blog/FormValues/Action.tsx"

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const { data: posts, isPending: isLoadingPost } = useGetPosts()
  const { mutateAsync: deletePost } = useDeletePost()
  const { mutateAsync: publishPost } = usePublishedPost()
  const [id, setId] = useState("")

  const handleDelete = async () => {
    try {
      await deletePost(id)
      setOpenModal(false)
      setId("")
    } catch (error) {
      toast.error("Failed to delete blog. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <ModalDeleteConfirm
        open={openModal}
        onOpenChange={setOpenModal}
        onDelete={handleDelete}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
        <Link to="/blogs/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách bài viết</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPost ? (
            <div className="flex justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts && posts?.data?.length > 0 ? (
                  posts?.data?.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">{blog.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          /{blog.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {blog.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {get(blog?.category, "name", "Chưa phân loại")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.published ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => {}}
                        >
                          {blog.published ? "Đã xuất bản" : "Bản nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {}}
                            title={
                              blog.published
                                ? "Ẩn bài viết"
                                : "Xuất bản bài viết"
                            }
                          >
                            {blog.published ? (
                              <EyeOff
                                className="size-4"
                                onClick={() =>
                                  publishPost({
                                    id: blog.id,
                                    payload: { published: false },
                                  })
                                }
                              />
                            ) : (
                              <Eye
                                className="size-4"
                                onClick={() =>
                                  publishPost({
                                    id: blog.id,
                                    payload: { published: true },
                                  })
                                }
                              />
                            )}
                          </Button>
                          <Link to={`/blogs/edit/${blog.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Chỉnh sửa"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </Link>
                          <Action post={blog} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {searchTerm
                        ? "Không tìm thấy bài viết phù hợp"
                        : "Chưa có bài viết nào"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

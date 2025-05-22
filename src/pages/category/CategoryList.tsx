import { useState } from "react"
import { Link } from "react-router-dom"
import { Edit, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetCategories } from "@/hooks/category.ts"
import { Badge } from "@/components/ui/badge"
import { DeleteCategoryBtn } from "@/pages/category/components/DeleteCategoryBtn.tsx"
import { PublishCategoryBtn } from "@/pages/category/components/PublishCategoryBtn.tsx"

export default function CategoryList() {
  const { data: categories, isFetching } = useGetCategories()
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Link to="/categories/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Tạo danh mục mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách danh mục</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm danh mục..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        <Badge
                          variant={category.published ? "default" : "secondary"}
                          className="cursor-pointer"
                        >
                          {category.published ? "Đã xuất bản" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {category.updatedAt
                          ? new Date(
                              String(category.updatedAt)
                            ).toLocaleDateString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PublishCategoryBtn category={category} />
                          <Link to={`/categories/edit/${category.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Chỉnh sửa"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </Link>
                          <DeleteCategoryBtn category={category} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {searchTerm
                        ? "Không tìm thấy danh mục phù hợp"
                        : "Chưa có danh mục nào"}
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

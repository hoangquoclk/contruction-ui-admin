import { type FocusEventHandler, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { getSlugFromTitle } from "@/utils"
import {
  useCreateCategory,
  useGetCategoryById,
  useUpdateCategory,
} from "@/hooks/category.ts"
import { omit } from "lodash"

// Define the form validation schema with Zod
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Tên danh mục phải có ít nhất 2 ký tự" })
    .max(50, { message: "Tên danh mục không được vượt quá 50 ký tự" }),
  slug: z
    .string()
    .min(2, { message: "Slug phải có ít nhất 2 ký tự" })
    .max(50, { message: "Slug không được vượt quá 50 ký tự" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
    }),
  published: z.boolean().default(false),
})

// Infer the type from the schema
type CategoryFormValues = z.infer<typeof categoryFormSchema>

export default function CategoryEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const {
    data: category,
    isSuccess,
    isFetching: isLoadingCategory,
  } = useGetCategoryById(id || "")

  const { mutateAsync: createPost, isPending: isCreatePending } =
    useCreateCategory()

  const { mutateAsync: updatePost, isPending: isUpdatePending } =
    useUpdateCategory()

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      published: true,
    },
  })

  useEffect(() => {
    if (isSuccess) {
      form.reset(categoryFormSchema.safeParse(category)?.data)
    }
  }, [form, isSuccess, category])

  // Handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEditMode) {
        await updatePost({ id, payload: omit(data, "name") })
      } else {
        await createPost(data)
      }
      navigate("/categories")
    } catch (error) {
      toast.error("Lưu danh mục thất bại. Vui lòng thử lại.")
    }
  }

  const handleBlurTitle: FocusEventHandler<HTMLInputElement> = (e) => {
    const generatedSlug = getSlugFromTitle(e.target.value)
    form.setValue("slug", generatedSlug, { shouldValidate: true })
  }

  const isSaving = [isCreatePending, isUpdatePending]?.some((loading) =>
    Boolean(loading)
  )

  if (isLoadingCategory) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/categories")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Thông tin danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên danh mục"
                        {...field}
                        onBlur={handleBlurTitle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-danh-muc" {...field} />
                    </FormControl>
                    <FormDescription>
                      Slug sẽ được sử dụng trong URL của danh mục. Ví dụ:
                      /categories/slug-danh-muc
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Published Field */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Trạng thái xuất bản
                      </FormLabel>
                      <FormDescription>
                        Danh mục sẽ {field.value ? "" : "không"} hiển thị công
                        khai trên trang web
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/categories")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    {isEditMode ? "Cập nhật" : "Lưu danh mục"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

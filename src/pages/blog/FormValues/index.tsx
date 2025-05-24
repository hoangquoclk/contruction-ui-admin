import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { cn } from "@/lib/utils.ts"
import MinimalTiptapThree from "@/components/minimal-tiptap/minimal-tiptap-three.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Loader2, Save } from "lucide-react"
import type { FocusEventHandler } from "react"
import { useEffect } from "react"
import { getSlugFromTitle } from "@/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import type { BlogFormValues } from "./FormValues.config"
import { blogFormSchema } from "./FormValues.config"
import { useGetCategories } from "@/hooks/category.ts"
import { useCreatePost, useGetPostById, useUpdatePost } from "@/hooks/post.ts"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch.tsx"
import { omit } from "lodash"

export const FormValues = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const { data: categories } = useGetCategories()

  const {
    data: post,
    isSuccess,
    isFetching: isLoadingPost,
  } = useGetPostById(id || "")

  const { mutateAsync: createPost, isPending: isCreatePending } =
    useCreatePost()

  const { mutateAsync: updatePost, isPending: isUpdatePending } =
    useUpdatePost()

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      thumbnail: "",
      description: "",
      content: "",
      categoryId: "",
      published: false,
    },
  })

  useEffect(() => {
    if (isSuccess) {
      form.reset(blogFormSchema.safeParse(post?.data)?.data)
    }
  }, [form, isSuccess, post?.data])

  const onSubmit = async (data: BlogFormValues) => {
    try {
      if (isEditMode) {
        await updatePost({ id, payload: omit(data, "categoryId") })
      } else {
        await createPost(data)
      }
    } catch (error) {
      toast.error("Lưu bài viết thất bại. Vui lòng thử lại.")
    }
  }

  const handleBlurTitle: FocusEventHandler<HTMLInputElement> = (e) => {
    const generatedSlug = getSlugFromTitle(e.target.value)
    form.setValue("slug", generatedSlug, { shouldValidate: true })
  }

  const isLoading = [isCreatePending, isUpdatePending, isLoadingPost]?.some(
    (loading) => Boolean(loading)
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Thông tin bài viết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề bài viết"
                      {...field}
                      onBlur={handleBlurTitle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  /!* Slug Field *!/*/}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-bai-viet" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Slug sẽ được sử dụng trong URL của bài viết. Ví dụ:
                    /blogs/slug-bai-viet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Field */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nhập URL hình ảnh để làm thumbnail cho bài viết (không bắt
                    buộc)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả ngắn về bài viết"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "group relative col-span-3 flex flex-col justify-between rounded-xl",
                        // light styles
                        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                        // dark styles
                        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                        "h-full min-h-56 w-full rounded-xl"
                      )}
                    >
                      <MinimalTiptapThree
                        key={field.name}
                        throttleDelay={0}
                        className={cn("h-full min-h-56 w-full rounded-xl")}
                        editorContentClassName="overflow-auto h-full"
                        output="html"
                        placeholder="Nhập nội dung chi tiết của bài viết..."
                        editable={true}
                        editorClassName="focus:outline-none px-5 py-4 h-full"
                        {...field}
                      />
                      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300" />
                    </div>
                  </FormControl>
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
              onClick={() => navigate("/blogs")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  {isEditMode ? "Cập nhật" : "Lưu bài viết"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

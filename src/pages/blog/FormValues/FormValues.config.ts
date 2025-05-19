import { z } from "zod"

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" })
    .max(100, { message: "Tiêu đề không được vượt quá 100 ký tự" }),
  slug: z
    .string()
    .min(3, { message: "Slug phải có ít nhất 3 ký tự" })
    .max(100, { message: "Slug không được vượt quá 100 ký tự" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
    }),
  description: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" })
    .max(500, { message: "Mô tả không được vượt quá 500 ký tự" }),
  content: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
  categoryId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string({ required_error: "Vui lòng chọn danh mục" })
  ),
  published: z.boolean().default(false),
})

// Infer the type from the schema
export type BlogFormValues = z.infer<typeof blogFormSchema>

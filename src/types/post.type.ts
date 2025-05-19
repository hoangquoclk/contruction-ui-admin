import type { BlogFormValues } from "@/pages/blog/FormValues/FormValues.config.ts"
import type { TCategoryResponse } from "@/types/category.type.ts"

export type TCreatePostPayload = BlogFormValues

export type TUpdatePostPayload = Omit<TCreatePostPayload, "categoryId">

export type TPublishedPayload = Pick<BlogFormValues, "published">

export type TPostResponse = {
  id: string
  title: string
  slug: string
  content: string
  description: string
  createdAt: string
  updatedAt: string
  published: boolean
  categoryId: string
  category: TCategoryResponse
}

import type { UseQueryOptions } from "@tanstack/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { REST_API_CATEGORY } from "@/api/url/url.ts"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  publishCategory,
  updateCategory,
} from "@/api/api.category.ts"
import type {
  TCategoryResponse,
  TCreateCategoryPayload,
  TPublishCategoryPayload,
  TUpdateCategoryPayload,
} from "@/types/category.type.ts"
import { toast } from "sonner"
import { queryClient } from "@/main.tsx"

export const useGetCategories = (
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TCategoryResponse[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    ...options,
    retry: false,
    queryKey: [REST_API_CATEGORY.LIST, params],
    queryFn: () => getCategories(params),
  })
}

export const useGetCategoryById = (
  id: string,
  options?: Omit<UseQueryOptions<TCategoryResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    ...options,
    queryKey: [REST_API_CATEGORY.GET_BY_ID, id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  return useMutation({
    mutationKey: [REST_API_CATEGORY.CREATE],
    mutationFn: (payload: TCreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      toast.success("Danh mục đã được tạo thành công.")
    },
  })
}

export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: [REST_API_CATEGORY.DELETE],
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully.")
    },
  })
}

export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: [REST_API_CATEGORY.UPDATE],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: TUpdateCategoryPayload
    }) => updateCategory(id, payload),
    onSuccess: () => {
      toast.success("Danh mục đã được cập nhật thành công.")
    },
  })
}

export const usePublishCategory = () => {
  return useMutation({
    mutationKey: [REST_API_CATEGORY.PUBLISHED],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: TPublishCategoryPayload
    }) => publishCategory(id, payload),
    onSuccess: (_, variables) => {
      if (!variables.payload.published) {
        toast.success("Danh mục đã được chuyển về thành bản nháp.")
      } else {
        toast.success("Danh mục đã được xuất bản thành công.")
      }
      queryClient.invalidateQueries({ queryKey: [REST_API_CATEGORY.LIST] })
    },
  })
}

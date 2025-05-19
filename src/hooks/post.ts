import type { UseQueryOptions } from "@tanstack/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { REST_API_POST } from "@/api/url/url.ts"
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByCategory,
  publishedPost,
  updatePost,
  uploadPost,
} from "@/api/api.post"
import type {
  TCreatePostPayload,
  TPostResponse,
  TPublishedPayload,
  TUpdatePostPayload,
} from "@/types/post.type.ts"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import type { TResponse } from "@/types/common.type.ts"
import { queryClient } from "@/main.tsx"

export const useGetPosts = (
  params?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TResponse<TPostResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<TResponse<TPostResponse[]>>({
    ...options,
    queryKey: [REST_API_POST.LIST, params],
    queryFn: () => getPosts(params),
  })
}

export const useGetPostsByCategory = (
  categoryId: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TPostResponse[]>, "queryKey" | "queryFn">
) => {
  return useQuery<TPostResponse[]>({
    ...options,
    queryKey: [REST_API_POST.LIST_BY_CATEGORY, params],
    queryFn: () => getPostsByCategory(categoryId),
  })
}

export const useGetPostById = (
  id: string,
  options?: Omit<
    UseQueryOptions<TResponse<TPostResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<TResponse<TPostResponse>>({
    ...options,
    queryKey: [REST_API_POST.GET_BY_ID, id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  })
}

export const useCreatePost = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [REST_API_POST.CREATE],
    mutationFn: (payload: TCreatePostPayload) => createPost(payload),
    onSuccess: () => {
      toast.success("Bài viết đã được tạo thành công.")
      navigate("/blogs")
    },
  })
}

export const useDeletePost = () => {
  return useMutation({
    mutationKey: [REST_API_POST.DELETE],
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      toast.success("Blog deleted successfully.")
      queryClient.invalidateQueries({ queryKey: [REST_API_POST.LIST] })
    },
  })
}

export const useUpdatePost = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [REST_API_POST.UPDATE],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: TUpdatePostPayload
    }) => updatePost(id, payload),
    onSuccess: () => {
      toast.success("Bài viết đã được cập nhật thành công.")
      navigate("/blogs")
      queryClient.invalidateQueries({
        queryKey: [REST_API_POST.GET_BY_ID],
      })
    },
  })
}

export const usePublishedPost = () => {
  return useMutation({
    mutationKey: [REST_API_POST.PUBLISHED],
    mutationFn: ({ id, payload }: { id: string; payload: TPublishedPayload }) =>
      publishedPost(id, payload),
    onSuccess: (_, variables) => {
      if (!variables.payload.published) {
        toast.success("Bài viết đã được chuyển về thành bản nháp.")
      } else {
        toast.success("Bài viết đã được xuất bản thành công.")
      }
      queryClient.invalidateQueries({ queryKey: [REST_API_POST.LIST] })
    },
  })
}

export const useUploadPost = () => {
  return useMutation({
    mutationKey: [REST_API_POST.UPLOAD],
    mutationFn: (formData: FormData) => uploadPost(formData),
  })
}

import qs from "query-string"
import { REST_API_POST } from "./url/url.ts"
import { HttpService } from "@/api/service/http-service.ts"
import type {
  TCreatePostPayload,
  TPostResponse,
  TPublishedPayload,
  TUpdatePostPayload,
} from "@/types/post.type.ts"
import type { TResponse } from "@/types/common.type.ts"

export const getPosts = (params?: Record<string, any>) => {
  const route = `${REST_API_POST.LIST.uri}?${qs.stringify(params || {}, {
    skipEmptyString: true,
    skipNull: true,
  })}`
  return HttpService.get<TResponse<TPostResponse[]>>(route)
}

export const getPostsByCategory = (
  categoryId: string,
  params?: Record<string, any>
) => {
  const route = `${REST_API_POST.LIST_BY_CATEGORY.uri.replace(":categoryId", categoryId)}?${qs.stringify(
    params || {},
    {
      skipEmptyString: true,
      skipNull: true,
    }
  )}`
  return HttpService.get<TPostResponse[]>(route)
}

export const getPostById = (id: string) => {
  const route = REST_API_POST.GET_BY_ID.uri.replace(":id", id)
  return HttpService.get<TResponse<TPostResponse>>(route)
}

export const deletePost = (id: string) => {
  const route = REST_API_POST.DELETE.uri.replace(":id", id)
  return HttpService.delete(route)
}

export const createPost = (data: TCreatePostPayload) => {
  return HttpService.post(REST_API_POST.CREATE.uri, data)
}

export const updatePost = (id: string, data: TUpdatePostPayload) => {
  const route = REST_API_POST.UPDATE.uri.replace(":id", id)
  return HttpService.patch(route, data)
}

export const publishedPost = (id: string, data: TPublishedPayload) => {
  const route = REST_API_POST.UPDATE.uri.replace(":id", id)
  return HttpService.patch(route, data)
}

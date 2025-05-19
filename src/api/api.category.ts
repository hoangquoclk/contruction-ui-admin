import { REST_API_CATEGORY } from "./url/url.ts"
import { HttpService } from "@/api/service/http-service.ts"
import qs from "query-string"
import type {
  TCategoryResponse,
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "@/types/category.type.ts"

export const getCategories = (params?: Record<string, any>) => {
  const route = `${REST_API_CATEGORY.LIST.uri}?${qs.stringify(params || {}, {
    skipEmptyString: true,
    skipNull: true,
  })}`
  return HttpService.get<TCategoryResponse[]>(route)
}

export const getCategoryById = (id: string) => {
  const route = REST_API_CATEGORY.GET_BY_ID.uri.replace(":id", id)
  return HttpService.get<TCategoryResponse>(route)
}

export const deleteCategory = (id: string) => {
  const route = REST_API_CATEGORY.DELETE.uri.replace(":id", id)
  return HttpService.delete(route)
}

export const createCategory = (data: TCreateCategoryPayload) => {
  return HttpService.post(REST_API_CATEGORY.CREATE.uri, data)
}

export const updateCategory = (id: string, payload: TUpdateCategoryPayload) => {
  const route = REST_API_CATEGORY.UPDATE.uri.replace(":id", id)
  return HttpService.patch(route, payload)
}

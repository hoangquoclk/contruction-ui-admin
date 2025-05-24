import { HttpService } from "@/api/service/http-service.ts"
import { REST_API_IMAGE } from "@/api/url/url.ts"
import type { TResponseUpload, TUploadFileItem } from "@/types/image.type.ts"

export const uploadImage = (
  formData: FormData,
  onProgress?: (percent: number) => void
) => {
  return HttpService.post<FormData, TResponseUpload>(
    REST_API_IMAGE.UPLOAD.uri,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress?.(percent)
      },
    }
  )
}

export const getImages = () => {
  return HttpService.get<TUploadFileItem[]>(REST_API_IMAGE.LIST.uri)
}

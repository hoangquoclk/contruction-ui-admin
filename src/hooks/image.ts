import { useMutation, useQuery } from "@tanstack/react-query"
import { REST_API_IMAGE } from "@/api/url/url.ts"
import { getImages, uploadImage } from "@/api/api.image.ts"
import { toast } from "sonner"
import { queryClient } from "@/main.tsx"

export const useUploadImage = () => {
  return useMutation({
    mutationKey: [REST_API_IMAGE.UPLOAD],
    mutationFn: ({
      formData,
      onProgress,
    }: {
      formData: FormData
      onProgress?: (percent: number | null) => void
    }) => uploadImage(formData, onProgress),
    onSuccess: (_, variables) => {
      toast.success(`File uploaded successfully.`)
      queryClient.invalidateQueries({ queryKey: [REST_API_IMAGE.LIST] })
      variables.onProgress?.(null)
    },
  })
}

export const useGetImages = () => {
  return useQuery({
    queryKey: [REST_API_IMAGE.LIST],
    queryFn: getImages,
  })
}

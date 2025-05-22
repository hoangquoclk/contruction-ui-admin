import type { TMessageError } from "@/types/common.type"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export class ApiError extends Error {
  message: string
  status: number
  errors: TMessageError[]
  data?: NonNullable<unknown>

  constructor(
    message: string,
    status: number = 0,
    data?: NonNullable<unknown>
  ) {
    super("")
    this.message = message
    this.errors = []
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export const HandleResponseError = (
  error: AxiosError<{
    message: string | TMessageError[]
    data: NonNullable<unknown>
  }>
) => {
  if (typeof error?.response?.data?.message === "string") {
    toast.error(error?.response?.data?.message)

    throw new ApiError(
      error.response.data.message,
      error.response?.status,
      error?.response?.data?.data
    )
  }

  toast.error("Unknown")

  throw new ApiError("Unknown", 400)
}

import { toast } from "sonner"

export class ApiError extends Error {
  message: string
  status: number
  // errors: TMessageError[]
  data?: NonNullable<unknown>

  constructor(
    message: string,
    status: number = 0,
    data?: NonNullable<unknown>
  ) {
    super("")
    this.message = message
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export type TMessageError = {
  [key: string]: string[]
}

export class ApiErrorForm extends Error {
  errors: TMessageError[]
  status: number

  constructor(message: TMessageError[], status: number = 0) {
    super("")
    this.errors = message
    this.name = "ApiErrorForm"
    this.status = status
  }
}

export type TApiError = ApiError | ApiErrorForm

export const HandleResponseError = () =>
  // error: AxiosError<{
  //   message: string | TMessageError[]
  //   data: NonNullable<unknown>
  // }>
  {
    toast.error("Internet Server Error")

    throw new ApiError("Unknown", 400)
  }

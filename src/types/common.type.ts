export type TResponse<T> = {
  message: string
  statusCode: number
  data: T
}

export type TMessageError = {
  [key: string]: string[]
}

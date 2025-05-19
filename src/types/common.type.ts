export type TResponse<T> = {
  message: string
  statusCode: number
  data: T
}

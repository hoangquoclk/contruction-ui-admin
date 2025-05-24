export type TUploadFileItem = {
  id: string
  filename: string
  url: string
  createdAt: string
  updatedAt: string
}

export type TResponseFile = {
  filename: string
  url: string
}

export type TResponseUpload = {
  data: TResponseFile
}

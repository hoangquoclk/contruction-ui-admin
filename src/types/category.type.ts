export type TCreateCategoryPayload = {
  name: string
  slug: string
  published: boolean
}

export type TUpdateCategoryPayload = Omit<TCreateCategoryPayload, "name">

export type TCategoryResponse = {
  id: string
  name: string
  slug: string
  published: boolean
  createdAt: boolean
  updatedAt: boolean
}

export type TPublishCategoryPayload = Pick<TUpdateCategoryPayload, "published">

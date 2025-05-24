export const REST_API_CATEGORY = {
  LIST: {
    uri: "categories",
    method: "GET",
  },
  GET_BY_ID: {
    uri: "categories/:id",
    method: "GET",
  },
  DELETE: {
    uri: "categories/:id",
    method: "DELETE",
  },
  CREATE: {
    uri: "categories",
    method: "POST",
  },
  UPDATE: {
    uri: "categories/:id",
    method: "PATCH",
  },
  PUBLISHED: {
    uri: "categories/:id",
    method: "PATCH",
  },
}

export const REST_API_POST = {
  LIST: {
    uri: "posts",
    method: "GET",
  },
  LIST_BY_CATEGORY: {
    uri: "posts/list-by-category/:categoryId",
    method: "GET",
  },
  GET_BY_ID: {
    uri: "posts/:id",
    method: "GET",
  },
  DELETE: {
    uri: "posts/:id",
    method: "DELETE",
  },
  CREATE: {
    uri: "posts",
    method: "POST",
  },
  UPDATE: {
    uri: "posts/:id",
    method: "PATCH",
  },
  PUBLISHED: {
    uri: "posts/:id",
    method: "PATCH",
  },
}

export const REST_API_IMAGE = {
  UPLOAD: {
    uri: "posts/upload",
    method: "POST",
  },
  LIST: {
    uri: "posts/images",
    method: "GET",
  },
}

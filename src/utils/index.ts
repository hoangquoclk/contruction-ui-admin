import Fuse from "fuse.js"

export const getSlugFromTitle = (title: string) => {
  return title
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/đ/g, "d") // Chuyển đ → d
    .normalize("NFD") // Tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // Xoá dấu
    .replace(/[^a-z0-9\s-]/g, "") // Xoá ký tự không hợp lệ
    .trim() // Xoá khoảng trắng đầu/cuối
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
}

export function searchWithFuse<T>({
  query,
  data,
  keys = ["name"],
}: {
  query: string
  data?: T[]
  keys?: string[]
}): T[] {
  if (!data) return []
  if (!query) return data
  const fuse = new Fuse(data, {
    keys,
    threshold: 0.3, // Mức độ chính xác: càng thấp càng chính xác
    ignoreLocation: true,
  })

  const results = fuse.search(query)
  return results.map((result) => result.item)
}

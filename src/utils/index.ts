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

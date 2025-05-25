import type React from "react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import {
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteImage, useGetImages, useUploadImage } from "@/hooks/image.ts"
import { BASE_URL } from "@/constants/map-env.ts"
import type { TUploadFileItem } from "@/types/image.type.ts"
import { useSearchList } from "@/hooks/useSearchList.ts"
import { Progress } from "@/components/ui/progress.tsx"

export default function ImageLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<TUploadFileItem | null>(
    null
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage()
  const { data: imageList, isFetching: isLoadingList } = useGetImages()
  const { mutate: deleteImage } = useDeleteImage()

  const filterList = useSearchList({
    searchTerm,
    list: imageList,
    keys: ["filename"],
  })

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i])
    }

    setUploadProgress(0)

    await uploadImage({
      formData,
      onProgress: (percent) => {
        setUploadProgress(percent)
      },
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Copy image URL to clipboard
  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(`${BASE_URL}${url}`)
    setCopiedId(id)
    toast.success("URL copied to clipboard!")

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {uploadProgress !== null && (
        <div className="my-4">
          <Progress value={uploadProgress} />
          <p className="mt-2 text-sm text-muted-foreground">
            Đang tải lên: {uploadProgress}%
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Thư viện hình ảnh</h1>
        <div className="flex gap-2">
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 size-4" />
            Tải lên
          </Button>
        </div>
      </div>

      <Card className="bg-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hình ảnh đã tải lên</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm hình ảnh..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Lưới</TabsTrigger>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              {isLoadingList ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : filterList && filterList?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filterList?.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-md border bg-background"
                    >
                      <img
                        src={`${BASE_URL}${item.url}` || "/placeholder.svg"}
                        alt={item.filename}
                        className="size-full cursor-pointer object-cover transition-all"
                        onClick={() => setSelectedImage(item)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8"
                          onClick={() => copyToClipboard(item.url, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="size-8"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa hình ảnh này? Hành
                                động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteImage(item.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 truncate bg-black/70 p-1 text-xs text-white">
                        {item.filename}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Không có hình ảnh nào</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm
                      ? "Không tìm thấy hình ảnh phù hợp"
                      : "Hãy tải lên hình ảnh đầu tiên của bạn"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list">
              {isLoadingList ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : filterList && filterList?.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 border-b p-4 font-medium">
                    <div className="col-span-7">Tên file</div>
                    <div className="col-span-3">Ngày tạo</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {filterList?.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-center gap-4 border-b p-4 last:border-0"
                    >
                      <div className="col-span-7 flex items-center gap-3">
                        <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={`${BASE_URL}${item.url}` || "/placeholder.svg"}
                            alt={item.filename}
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                        <span className="truncate">{item.filename}</span>
                      </div>
                      <div className="col-span-3">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => copyToClipboard(item.url, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa hình ảnh này? Hành
                                động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteImage(item.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Không có hình ảnh nào</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm
                      ? "Không tìm thấy hình ảnh phù hợp"
                      : "Hãy tải lên hình ảnh đầu tiên của bạn"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{selectedImage?.filename}</span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setSelectedImage(null)}
              >
                <X className="size-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {new Date(selectedImage?.createdAt || "").toLocaleDateString(
                "vi-VN"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center">
            <div className="relative max-h-[60vh] w-full overflow-hidden rounded-md">
              <img
                src={`${BASE_URL}${selectedImage?.url}` || "/placeholder.svg"}
                alt={selectedImage?.filename}
                className="h-auto w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder.svg?height=400&width=600"
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full items-center justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này
                      không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                onClick={() =>
                  selectedImage &&
                  copyToClipboard(selectedImage.url, selectedImage.id)
                }
              >
                {copiedId === selectedImage?.id ? (
                  <>
                    <Check className="mr-2 size-4" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 size-4" />
                    Sao chép URL
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

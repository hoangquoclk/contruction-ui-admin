"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
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

// Define the Media type
interface Media {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

export default function ImageLibrary() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<Media | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch media from the API
  const fetchMedia = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/media")
      setMedia(response.data)
    } catch (error) {
      console.error("Failed to fetch media:", error)
      toast.error("Failed to fetch media. Please try again.")

      // Mock data for demonstration
      setMedia([
        {
          id: "1",
          name: "house-exterior.jpg",
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
          type: "image/jpeg",
          size: 1024000,
          createdAt: "2025-05-18T11:09:45.975Z",
        },
        {
          id: "2",
          name: "modern-interior.jpg",
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
          type: "image/jpeg",
          size: 2048000,
          createdAt: "2025-05-17T10:15:30.975Z",
        },
        {
          id: "3",
          name: "kitchen-design.jpg",
          url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800",
          type: "image/jpeg",
          size: 1536000,
          createdAt: "2025-05-16T09:22:15.975Z",
        },
        {
          id: "4",
          name: "living-room.jpg",
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800",
          type: "image/jpeg",
          size: 1843000,
          createdAt: "2025-05-15T14:30:45.975Z",
        },
        {
          id: "5",
          name: "bathroom-design.jpg",
          url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800",
          type: "image/jpeg",
          size: 1267000,
          createdAt: "2025-05-14T16:45:20.975Z",
        },
        {
          id: "6",
          name: "bedroom-interior.jpg",
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800",
          type: "image/jpeg",
          size: 1752000,
          createdAt: "2025-05-13T12:10:35.975Z",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // Filter media based on search term
  const filteredMedia = media

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      // In a real app, you would use axios to upload the files
      // const response = await axios.post("/api/media/upload", formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //     setUploadProgress(percentCompleted)
      //   },
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful upload
      const newMedia: Media[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        createdAt: new Date().toISOString(),
      }))

      setMedia([...newMedia, ...media])
      setUploadProgress(100)
      toast.success(`${files.length} file(s) uploaded successfully.`)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Failed to upload files:", error)
      toast.error("Failed to upload files. Please try again.")
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  // Copy image URL to clipboard
  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success("URL copied to clipboard!")

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  // Delete an image
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/media/${id}`)
      setMedia(media.filter((item) => item.id !== id))
      toast.success("File deleted successfully.")

      // Close the image preview if the deleted image was selected
      if (selectedImage?.id === id) {
        setSelectedImage(null)
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
      toast.error("Failed to delete file. Please try again.")

      // For demo purposes, still remove from the UI
      setMedia(media.filter((item) => item.id !== id))
      if (selectedImage?.id === id) {
        setSelectedImage(null)
      }
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    )
  }

  return (
    <div className="space-y-6">
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

      {uploading && (
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <Card>
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

            {/*<TabsContent value="grid">*/}
            {/*  {loading ? (*/}
            {/*    <div className="flex justify-center py-8">*/}
            {/*      <Loader2 className="size-8 animate-spin text-primary" />*/}
            {/*    </div>*/}
            {/*  ) : filteredMedia.length > 0 ? (*/}
            {/*    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">*/}
            {/*      {filteredMedia.map((item) => (*/}
            {/*        <div*/}
            {/*          key={item.id}*/}
            {/*          className="group relative aspect-square overflow-hidden rounded-md border bg-background"*/}
            {/*        >*/}
            {/*          <img*/}
            {/*            src={item.url || "/placeholder.svg"}*/}
            {/*            alt={item.name}*/}
            {/*            className="size-full cursor-pointer object-cover transition-all"*/}
            {/*            onClick={() => setSelectedImage(item)}*/}
            {/*            onError={(e) => {*/}
            {/*              (e.target as HTMLImageElement).src =*/}
            {/*                "/placeholder.svg?height=200&width=200"*/}
            {/*            }}*/}
            {/*          />*/}
            {/*          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">*/}
            {/*            <Button*/}
            {/*              variant="secondary"*/}
            {/*              size="icon"*/}
            {/*              className="size-8"*/}
            {/*              onClick={() => copyToClipboard(item.url, item.id)}*/}
            {/*            >*/}
            {/*              {copiedId === item.id ? (*/}
            {/*                <Check className="size-4" />*/}
            {/*              ) : (*/}
            {/*                <Copy className="size-4" />*/}
            {/*              )}*/}
            {/*            </Button>*/}
            {/*            <AlertDialog>*/}
            {/*              <AlertDialogTrigger asChild>*/}
            {/*                <Button*/}
            {/*                  variant="destructive"*/}
            {/*                  size="icon"*/}
            {/*                  className="size-8"*/}
            {/*                >*/}
            {/*                  <Trash2 className="size-4" />*/}
            {/*                </Button>*/}
            {/*              </AlertDialogTrigger>*/}
            {/*              <AlertDialogContent>*/}
            {/*                <AlertDialogHeader>*/}
            {/*                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>*/}
            {/*                  <AlertDialogDescription>*/}
            {/*                    Bạn có chắc chắn muốn xóa hình ảnh này? Hành*/}
            {/*                    động này không thể hoàn tác.*/}
            {/*                  </AlertDialogDescription>*/}
            {/*                </AlertDialogHeader>*/}
            {/*                <AlertDialogFooter>*/}
            {/*                  <AlertDialogCancel>Hủy</AlertDialogCancel>*/}
            {/*                  <AlertDialogAction*/}
            {/*                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"*/}
            {/*                    onClick={() => handleDelete(item.id)}*/}
            {/*                  >*/}
            {/*                    Xóa*/}
            {/*                  </AlertDialogAction>*/}
            {/*                </AlertDialogFooter>*/}
            {/*              </AlertDialogContent>*/}
            {/*            </AlertDialog>*/}
            {/*          </div>*/}
            {/*          <div className="absolute inset-x-0 bottom-0 truncate bg-black/70 p-1 text-xs text-white">*/}
            {/*            {item.name}*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*  ) : (*/}
            {/*    <div className="flex flex-col items-center justify-center py-12 text-center">*/}
            {/*      <ImageIcon className="mb-4 size-12 text-muted-foreground" />*/}
            {/*      <h3 className="text-lg font-medium">Không có hình ảnh nào</h3>*/}
            {/*      <p className="mt-1 text-sm text-muted-foreground">*/}
            {/*        {searchTerm*/}
            {/*          ? "Không tìm thấy hình ảnh phù hợp"*/}
            {/*          : "Hãy tải lên hình ảnh đầu tiên của bạn"}*/}
            {/*      </p>*/}
            {/*      {!searchTerm && (*/}
            {/*        <Button*/}
            {/*          className="mt-4"*/}
            {/*          onClick={() => fileInputRef.current?.click()}*/}
            {/*        >*/}
            {/*          <Upload className="mr-2 size-4" />*/}
            {/*          Tải lên ngay*/}
            {/*        </Button>*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</TabsContent>*/}

            <TabsContent value="list">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 border-b p-4 font-medium">
                    <div className="col-span-5">Tên file</div>
                    <div className="col-span-3">Kích thước</div>
                    <div className="col-span-2">Ngày tạo</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {/*{filteredMedia.map((item) => (*/}
                  {/*  <div*/}
                  {/*    key={item.id}*/}
                  {/*    className="grid grid-cols-12 items-center gap-4 border-b p-4 last:border-0"*/}
                  {/*  >*/}
                  {/*    <div className="col-span-5 flex items-center gap-3">*/}
                  {/*      <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">*/}
                  {/*        <img*/}
                  {/*          src={item.url || "/placeholder.svg"}*/}
                  {/*          alt={item.name}*/}
                  {/*          className="size-full object-cover"*/}
                  {/*          onError={(e) => {*/}
                  {/*            (e.target as HTMLImageElement).src =*/}
                  {/*              "/placeholder.svg?height=40&width=40"*/}
                  {/*          }}*/}
                  {/*        />*/}
                  {/*      </div>*/}
                  {/*      <span className="truncate">{item.name}</span>*/}
                  {/*    </div>*/}
                  {/*    <div className="col-span-3">*/}
                  {/*      {formatFileSize(item.size)}*/}
                  {/*    </div>*/}
                  {/*    <div className="col-span-2">*/}
                  {/*      {new Date(item.createdAt).toLocaleDateString("vi-VN")}*/}
                  {/*    </div>*/}
                  {/*    <div className="col-span-2 flex justify-end gap-2">*/}
                  {/*      <Button*/}
                  {/*        variant="outline"*/}
                  {/*        size="icon"*/}
                  {/*        className="size-8"*/}
                  {/*        onClick={() => copyToClipboard(item.url, item.id)}*/}
                  {/*      >*/}
                  {/*        {copiedId === item.id ? (*/}
                  {/*          <Check className="size-4" />*/}
                  {/*        ) : (*/}
                  {/*          <Copy className="size-4" />*/}
                  {/*        )}*/}
                  {/*      </Button>*/}
                  {/*      <AlertDialog>*/}
                  {/*        <AlertDialogTrigger asChild>*/}
                  {/*          <Button*/}
                  {/*            variant="outline"*/}
                  {/*            size="icon"*/}
                  {/*            className="size-8 text-destructive hover:bg-destructive/10"*/}
                  {/*          >*/}
                  {/*            <Trash2 className="size-4" />*/}
                  {/*          </Button>*/}
                  {/*        </AlertDialogTrigger>*/}
                  {/*        <AlertDialogContent>*/}
                  {/*          <AlertDialogHeader>*/}
                  {/*            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>*/}
                  {/*            <AlertDialogDescription>*/}
                  {/*              Bạn có chắc chắn muốn xóa hình ảnh này? Hành*/}
                  {/*              động này không thể hoàn tác.*/}
                  {/*            </AlertDialogDescription>*/}
                  {/*          </AlertDialogHeader>*/}
                  {/*          <AlertDialogFooter>*/}
                  {/*            <AlertDialogCancel>Hủy</AlertDialogCancel>*/}
                  {/*            <AlertDialogAction*/}
                  {/*              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"*/}
                  {/*              onClick={() => handleDelete(item.id)}*/}
                  {/*            >*/}
                  {/*              Xóa*/}
                  {/*            </AlertDialogAction>*/}
                  {/*          </AlertDialogFooter>*/}
                  {/*        </AlertDialogContent>*/}
                  {/*      </AlertDialog>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*))}*/}
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
                  {!searchTerm && (
                    <Button
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 size-4" />
                      Tải lên ngay
                    </Button>
                  )}
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
              <span className="truncate">{selectedImage?.name}</span>
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
              {formatFileSize(selectedImage?.size || 0)} ·{" "}
              {new Date(selectedImage?.createdAt || "").toLocaleDateString(
                "vi-VN"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center">
            <div className="relative max-h-[60vh] w-full overflow-hidden rounded-md">
              <img
                src={selectedImage?.url || "/placeholder.svg"}
                alt={selectedImage?.name}
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
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        if (selectedImage) {
                          handleDelete(selectedImage.id)
                        }
                      }}
                    >
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

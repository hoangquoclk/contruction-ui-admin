import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useUploadImage } from "@/hooks/image.ts"
import { BASE_URL } from "@/constants/map-env.ts"

interface ImageEditBlockProps {
  editor: Editor
  close: () => void
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
  editor,
  close,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [link, setLink] = React.useState("")
  const { mutateAsync: uploadImage } = useUploadImage()

  const handleClick = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return

      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i])
      }

      const response = await uploadImage({
        formData,
      })

      editor.commands.setImages([{ src: `${BASE_URL}${response?.data?.url}` }])
      close()
    },
    [editor, close]
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (link) {
        editor.commands.setImages([{ src: link }])
        close()
      }
    },
    [editor, link, close]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="image-link">Attach an image link</Label>
        <div className="flex">
          <Input
            id="image-link"
            type="url"
            required
            placeholder="https://example.com"
            value={link}
            className="grow"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value)
              setLink(e.target.value)
            }}
          />
          <Button type="submit" className="ml-2">
            Submit
          </Button>
        </div>
      </div>
      <Button type="button" className="w-full" onClick={handleClick}>
        Upload from your computer
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFile}
      />
    </form>
  )
}

export default ImageEditBlock

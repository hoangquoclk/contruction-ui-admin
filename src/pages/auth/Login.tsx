"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Predefined credentials
const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "kientrucnetdepviet123",
}

// Define the form validation schema with Zod
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
})

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginFormSchema>

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials
      if (
        data.email === ADMIN_CREDENTIALS.email &&
        data.password === ADMIN_CREDENTIALS.password
      ) {
        // Set authentication flag in localStorage
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", data.email)
        localStorage.setItem("loginTime", new Date().toISOString())

        // Show success message
        toast.success("Đăng nhập thành công!", {
          description: "Chào mừng bạn quay trở lại!",
        })

        // Navigate to dashboard
        navigate("/")
      } else {
        // Show error for invalid credentials
        toast.error("Thông tin đăng nhập không chính xác", {
          description: "Vui lòng kiểm tra lại email và mật khẩu.",
        })

        // Reset password field
        form.setValue("password", "")
        form.setFocus("password")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Có lỗi xảy ra", {
        description: "Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-background">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Đăng nhập Admin</CardTitle>
          <CardDescription>
            Nhập thông tin đăng nhập để truy cập hệ thống quản trị
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4 text-muted-foreground" />
                          ) : (
                            <Eye className="size-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 size-4" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

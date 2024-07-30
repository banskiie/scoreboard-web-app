"use client"

import { useEffect, useState } from "react"
// Shadcn Components
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// Assets
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import { Loader2 } from "lucide-react"
// Stores and Options
import { COURTS } from "@/store/options"
import { useAuthStore } from "@/store/auth"
import { LOGIN_FORM_SCHEMA } from "@/schema"
import { Option } from "@/types"
// Navigation
import { usePathname, useRouter } from "next/navigation"
// Form Handling
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// Firebase
import { FIREBASE_AUTH } from "@/utils/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

const Page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState<boolean>(false)
  const { user, setUser } = useAuthStore()
  const form = useForm<z.infer<typeof LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: {
      user: "",
      password: "",
    },
  })
  const selectedUser = form.watch("user")

  useEffect(() => {
    if (user?.email === "admin@cone.ph") {
      router.push("/admin")
    } else if (user?.displayName?.includes("Court")) {
      router.push("/court")
    } else if (!user && pathname !== "/") {
      router.push("/")
    } else {
      console.log("No user signed in.")
    }
  }, [user])

  useEffect(() => {
    selectedUser.includes("court")
      ? form.setValue("password", selectedUser.split("@")[0])
      : form.resetField("password")
  }, [selectedUser])

  const signIn = async (payload: z.infer<typeof LOGIN_FORM_SCHEMA>) => {
    setLoading(true)
    try {
      const { user: email, password } = payload
      const response = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      )
      setUser(response.user)
      if (user) toast.success("Login Successful!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary w-full h-screen flex items-center justify-center">
      <Card className="w-[400px] rounded-sm p-4">
        <Image
          priority
          src={logo}
          alt="System Logo"
          className="w-[440px] object-contain mb-3"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(signIn)} className="flex flex-col">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user / court" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Users</SelectLabel>
                          <SelectItem value="admin@cone.ph">
                            Administrator
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Courts</SelectLabel>
                          {COURTS.map((court: Option, index: number) => (
                            <SelectItem
                              value={court.value as string}
                              key={index}
                            >
                              {court.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {selectedUser === "admin@cone.ph" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default Page

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_FORM } from "@/schema"
import { CATEGORY_GENDERS, CATEGORY_TYPES } from "@/store/options"
import { FIRESTORE_DB } from "@/utils/firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { Loader2 } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Option } from "@/types"

const CategoryForm = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const form = useForm<z.infer<typeof CATEGORY_FORM>>({
    resolver: zodResolver(CATEGORY_FORM),
    values: data ?? {
      category_gender: "mixed",
      category_name: "",
      category_type: "singles",
    },
  })

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const ref = doc(FIRESTORE_DB, `categories/${id}`)
          onSnapshot(ref, {
            next: (snapshot) => {
              if (snapshot.exists()) {
                setData(snapshot.data())
              }
            },
          })
        } catch (error: any) {
          console.error(error)
        }
      }

      fetchCategory()
    }
  }, [id])

  const submit = async (payload: z.infer<typeof CATEGORY_FORM>) => {
    try {
      if (id) {
        await updateDoc(doc(FIRESTORE_DB, `categories/${id}`), payload)
        toast.info("Category Updated!")
      } else {
        await addDoc(collection(FIRESTORE_DB, "categories"), {
          ...payload,
          created_date: moment().valueOf(),
        })
        toast.success("Category Added!")
      }
      close()
    } catch (error: unknown) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const close = () => {
    if (id) dialogClose()
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) close()
      }}
    >
      {!id && (
        <DialogTrigger asChild>
          <Button>Add Category</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Category</DialogTitle>
          <DialogDescription>
            Make changes here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit(submit)}
          >
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Category Name <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_gender"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Category Gender <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          {CATEGORY_GENDERS.map(
                            (gender: Option, index: number) => (
                              <SelectItem
                                value={gender.value as string}
                                key={index}
                                className="capitalize"
                              >
                                <span className="capitalize">
                                  {gender.label}
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Category Type <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          {CATEGORY_TYPES.map((type: Option, index: number) => (
                            <SelectItem
                              value={type.value as string}
                              key={index}
                              className="capitalize"
                            >
                              <span className="capitalize">{type.label}</span>
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
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryForm

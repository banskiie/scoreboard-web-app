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
import { OFFICIAL_FORM } from "@/schema"
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

const OfficialForm = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const form = useForm<z.infer<typeof OFFICIAL_FORM>>({
    resolver: zodResolver(OFFICIAL_FORM),
    values: data ?? {
      first_name: "",
      last_name: "",
      contact_no: "",
    },
  })

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  useEffect(() => {
    if (id) {
      const fetchOfficial = async () => {
        try {
          const ref = doc(FIRESTORE_DB, `officials/${id}`)
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

      fetchOfficial()
    }
  }, [id])

  const submit = async (payload: z.infer<typeof OFFICIAL_FORM>) => {
    try {
      if (id) {
        await updateDoc(doc(FIRESTORE_DB, `officials/${id}`), payload)
        toast.info(
          `Official Updated: ${payload.first_name} ${payload.last_name}`
        )
      } else {
        await addDoc(collection(FIRESTORE_DB, "officials"), {
          ...payload,
          created_date: moment().valueOf(),
        })
        toast.success(
          `Official Added: ${payload.first_name} ${payload.last_name}`
        )
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
          <Button>Add Official</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Official</DialogTitle>
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
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    First Name <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Last Name <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_no"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contact No.</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Contact No."
                      {...field}
                    />
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

export default OfficialForm

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
import { COURT_FORM_SCHEMA } from "@/schema"
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

const CourtForm = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const form = useForm<z.infer<typeof COURT_FORM_SCHEMA>>({
    resolver: zodResolver(COURT_FORM_SCHEMA),
    values: data ?? {
      court_name: "",
      court_in_use: false,
      court_email: "",
    },
  })

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  useEffect(() => {
    if (id) {
      const fetchCourt = async () => {
        try {
          const ref = doc(FIRESTORE_DB, `courts/${id}`)
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

      fetchCourt()
    }
  }, [id])

  const submit = async (payload: z.infer<typeof COURT_FORM_SCHEMA>) => {
    try {
      if (id) {
        await updateDoc(doc(FIRESTORE_DB, `courts/${id}`), payload)
        toast.info("Court Updated: " + payload.court_name)
      } else {
        await addDoc(collection(FIRESTORE_DB, "courts"), {
          ...payload,
          created_date: moment().valueOf(),
        })
        toast.success("Court Added: " + payload.court_name)
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
          <Button>Add Court</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Court</DialogTitle>
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
              name="court_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Court <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Court Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court_email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Email <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Court Email"
                      type="email"
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

export default CourtForm

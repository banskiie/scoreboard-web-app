import React, { useEffect, useState } from "react"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteDoc, doc } from "firebase/firestore"
import { FIRESTORE_DB } from "@/utils/firebase"
import { toast } from "sonner"

const DeleteGame = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  const deleteDocument = async (gameId: string) => {
    const docRef = doc(FIRESTORE_DB, "games", gameId)
    try {
      await deleteDoc(docRef)
      toast.success("Game deleted!")
    } catch (error) {
      toast.error("Oops! Something went wrong.")
    } finally {
      dialogClose()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) dialogClose()
      }}
      modal={true}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Game</DialogTitle>
          <DialogDescription>
            This will delete game from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            className="bg-red-700 hover:bg-red-600"
            onClick={() => deleteDocument(id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteGame

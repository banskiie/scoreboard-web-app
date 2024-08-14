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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { COURT_FORM_SCHEMA } from "@/schema"
import { FIRESTORE_DB } from "@/utils/firebase"
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
import { toast } from "sonner"
import { z } from "zod"
import Papa from "papaparse"

const UploadSchedule = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadedSchedule, setUploadedSchedule] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        if (e) {
          const fileContent = e.target.result
          setUploadedSchedule(fileContent)
          setFileName(file.name)
        }
      }
      reader.readAsText(file)
    }
  }

  const sendSched = async (payload: any) => {
    try {
      await addDoc(collection(FIRESTORE_DB, "games"), payload)
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const handleUpload = async () => {
    if (uploadedSchedule) {
      try {
        const sched = JSON.parse(uploadedSchedule)
        sched.map((item: any) => {
          const setCount = Array.from(
            { length: item["No. Of Sets"] },
            (_, index) => ({
              [`set_${index + 1}`]: {
                a_score: 0,
                b_score: 0,
                current_round: 1,
                last_team_scored: "",
                winner: "",
                scoresheet: [
                  {
                    team_scored: "",
                    scored_at: "",
                    a_switch: true,
                    b_switch: true,
                    current_a_score: 0,
                    current_b_score: 0,
                    scorer: "",
                    to_serve: "",
                    next_serve: "",
                  },
                ],
                switch: false,
              },
            })
          )
          const payload = {
            details: {
              created_date: Date.now(),
              game_no: `${item["Round"]} - ${item["Nr"]}`,
              court: item["Court"],
              category: `${item["Event"]}.${item["Type"].toLowerCase()}`,
              group_no: item["Group"],
              no_of_sets: item["No. Of Sets"],
              max_score: item["Max Score"],
              shuttles_used: 0,
              game_winner: "",
              playing_set: 1,
              plus_two_rule: false,
              plus_two_score: 40,
            },
            sets: {
              ...Object.assign({}, ...setCount),
            },
            time: {
              slot: moment(item["Time Slot"]).toDate(),
            },
            players: {
              team_a: {
                team_name: item["A Name"],
                player_1: {
                  first_name: item["A1 First"],
                  last_name: item["A1 Last"],
                  nickname: "",
                  use_nickname: false,
                },
                player_2: {
                  first_name: item["A2 First"],
                  last_name: item["A2 Last"],
                  nickname: "",
                  use_nickname: false,
                },
              },
              team_b: {
                team_name: item["B Name"],
                player_1: {
                  first_name: item["B1 First"],
                  last_name: item["B1 Last"],
                  nickname: "",
                  use_nickname: false,
                },
                player_2: {
                  first_name: item["B2 First"],
                  last_name: item["B2 Last"],
                  nickname: "",
                  use_nickname: false,
                },
              },
            },
            officials: {
              umpire: item["Umpire"],
              service_judge: item["Service Judge"],
              referee: item["Referee"],
            },
            statuses: {
              current: "upcoming",
              active: false,
            },
          }
          // console.log(payload)
          sendSched(payload)
        })
        reset()
      } catch (error) {
        console.error("Error parsing JSON:", error)
      }
    }
  }

  const reset = () => {
    setUploadedSchedule("")
    setFileName("")
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) close()
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-700 hover:bg-orange-600">
          Upload Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Schedule</DialogTitle>
          <DialogDescription>
            Add new schedules via JSON file.
          </DialogDescription>
        </DialogHeader>
        <Input
          id="picture"
          type="file"
          className="pt-1.5"
          accept=".json"
          onChange={handleFileChange}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            className="bg-orange-700 hover:bg-orange-600"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadSchedule

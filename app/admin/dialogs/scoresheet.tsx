import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FIRESTORE_DB } from "@/utils/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import moment from "moment"
import { useEffect, useState } from "react"

type DetailProps = {
  title: string
  description: string | number | any
}

const Detail = ({ title, description }: DetailProps) => {
  return (
    <div className="grid grid-cols-5">
      <span className="capitalize text-xs col-span-2">{title}:</span>
      <span className="font-bold text-xs col-span-3 border-b-[1px] border-dashed border-black px-1">
        {description}
      </span>
    </div>
  )
}

const Scoresheet = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [doubles, setDoubles] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  useEffect(() => {
    if (id) {
      const fetchGame = async () => {
        try {
          const ref = doc(FIRESTORE_DB, `games/${id}`)
          onSnapshot(ref, {
            next: (snapshot) => {
              if (snapshot.exists()) {
                setData(snapshot.data())
                setDoubles(
                  snapshot.data().details.category.split(".")[1] === "doubles"
                )
              }
            },
          })
        } catch (error: any) {
          console.error(error)
        }
      }

      fetchGame()
    }
  }, [id])

  const close = () => {
    if (id) dialogClose()
    setOpen(false)
  }

  const fetchPlayerName = (player: string): string =>
    data?.players[`team_${player[0]}`][`player_${player[1]}`].use_nickname
      ? data?.players[`team_${player[0]}`][`player_${player[1]}`].nickname
      : `${
          data?.players[`team_${player[0]}`][`player_${player[1]}`].first_name
        } ${
          data?.players[`team_${player[0]}`][`player_${player[1]}`].last_name
        }`

  return (
    <>
      <style jsx global>{`
        @page {
          size: letter landscape;
          margin: 0;
        }

        @media print {
          .dialog-footer {
            display: none;
          }
          .dialog-content {
            border: none;
            box-shadow: none;
          }
          .dialog {
            padding-top: 500px;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) close()
        }}
        modal={true}
      >
        <DialogContent className="dialog-content max-w-screen h-screen py-20 px-10">
          <ScrollArea className="h-full">
            <DialogHeader className="hidden">
              <DialogTitle>{id ? "Edit" : "Add"} Game</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <span className="text-lg font-bold">
                  C-ONE Badminton Challenge v7.0
                </span>
              </div>
              {/* Header Data */}
              <div className="grid grid-cols-11 gap-x-4 items-end">
                {/* First Line */}
                <div className="col-span-2 flex flex-col gap-1">
                  <Detail
                    title="event"
                    description={data?.details?.category.split(".")[0]}
                  />
                  <Detail
                    title="game no."
                    description={`${data?.details?.game_no} - #${data?.details?.group_no}`}
                  />
                  <Detail
                    title="date"
                    description={moment.unix(data?.time.slot).format("d MMM y")}
                  />
                  <Detail
                    title="time"
                    description={moment.unix(data?.time.slot).format("hh:mm a")}
                  />
                </div>
                {/* Score Summary */}
                <div className="col-span-5 flex flex-col gap-1 items-center justify-center">
                  <div className="w-full flex justify-center">
                    <span className="text-center">Scores</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {/* Left Team */}
                    <div className="flex">
                      <div className="w-[1.65rem] h-[1.65rem] flex items-center justify-center border-l-[1px] border-t-[1px] border-b-[1px] border-black">
                        <span className="text-center font-black text-lg">
                          L
                        </span>
                      </div>
                      <div className="w-52 border-[1px] border-black">
                        <div className="h-6 px-2 flex items-center">
                          <span className="text-xs">
                            {fetchPlayerName("a1")}
                          </span>
                        </div>
                        <div className="h-6 px-2 flex items-center border-t-[1px] border-dashed border-black">
                          <span className="text-xs">
                            {fetchPlayerName("a2")}
                          </span>
                        </div>
                        <div className="h-6 px-2 flex items-center border-t-[1px] border-black">
                          <span className="text-xs">
                            {data?.players?.team_a.team_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col h-full border-[1px] border-black">
                      {Array.from({ length: data?.details.no_of_sets }).map(
                        (_, index: number) => {
                          const a_score = data?.sets[`set_${index + 1}`].a_score
                          const b_score = data?.sets[`set_${index + 1}`].b_score
                          const set_winner =
                            data?.sets[`set_${index + 1}`].winner

                          if (!a_score) return
                          return (
                            <div
                              key={index}
                              className="w-20 px-2 h-6 items-center justify-between grid grid-cols-5"
                            >
                              <span
                                className={`col-span-2 text-center ${
                                  set_winner === "a" ? "font-bold" : undefined
                                }`}
                              >
                                {a_score}
                              </span>
                              <span className="text-center">:</span>
                              <span
                                className={`col-span-2 text-center ${
                                  set_winner === "b" ? "font-bold" : undefined
                                }`}
                              >
                                {b_score}
                              </span>
                            </div>
                          )
                        }
                      )}
                    </div>
                    {/* Right Team */}
                    <div className="flex">
                      <div className="w-52 border-[1px] border-black">
                        <div className="h-6 px-2 flex items-center">
                          <span className="text-xs">
                            {fetchPlayerName("b1")}
                          </span>
                        </div>
                        <div className="h-6 px-2 flex items-center border-t-[1px] border-dashed border-black">
                          <span className="text-xs">
                            {fetchPlayerName("b2")}
                          </span>
                        </div>
                        <div className="h-6 px-2 flex items-center border-t-[1px] border-black">
                          <span className="text-xs">
                            {data?.players?.team_b.team_name}
                          </span>
                        </div>
                      </div>
                      <div className="w-[1.65rem] h-[1.65rem] flex items-center justify-center border-r-[1px] border-t-[1px] border-b-[1px] border-black">
                        <span className="text-center font-black text-lg">
                          R
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Second Line */}
                <div className="col-span-2 flex flex-col gap-1">
                  <Detail title="court" description={data?.details?.court} />
                  <Detail
                    title="umpire"
                    description={data?.officials?.umpire}
                  />
                  <Detail
                    title="judge"
                    description={data?.officials?.service_judge}
                  />
                </div>
                {/* Third Line */}
                <div className="col-span-2 flex flex-col gap-1">
                  <Detail
                    title="shuttles"
                    description={data?.details?.shuttles_used}
                  />
                  <Detail
                    title="start"
                    description={moment
                      .unix(data?.time.start.seconds)
                      .format("hh:mm a")}
                  />
                  <Detail
                    title="end"
                    description={moment
                      .unix(data?.time.end.seconds)
                      .format("hh:mm a")}
                  />
                  <Detail
                    title="duration"
                    description={
                      Math.trunc(
                        moment
                          .duration(
                            moment
                              .unix(data?.time.end.seconds)
                              .diff(moment.unix(data?.time.start.seconds))
                          )
                          .asMinutes()
                      ) +
                      "m " +
                      Math.trunc(
                        moment
                          .duration(
                            moment
                              .unix(data?.time.end.seconds)
                              .diff(moment.unix(data?.time.start.seconds))
                          )
                          .seconds()
                      ) +
                      "s"
                    }
                  />
                </div>
              </div>
              {/* Scoresheet */}
              <div className="mt-6">
                {data?.sets &&
                  (() => {
                    const sets = Object.values(data?.sets).reverse()
                    return sets.map((_: any, index: number) => {
                      const scoresheet =
                        data?.sets[`set_${index + 1}`]?.scoresheet
                      const size = 33
                      const chunks = []

                      for (let i = 0; i < scoresheet.length; i += size) {
                        chunks.push(scoresheet.slice(i, i + size))
                      }

                      return (
                        <div
                          key={index}
                          className={`${
                            scoresheet.length > 1 ? "flex flex-col" : "hidden"
                          }`}
                        >
                          {chunks.map((chunk: any, chunkIndex: number) => (
                            <ScoresheetView
                              key={chunkIndex}
                              scores={chunk}
                              doubles={doubles}
                              fetchName={fetchPlayerName}
                              set={index + 1}
                              startingIndex={chunkIndex * size}
                            />
                          ))}
                        </div>
                      )
                    })
                  })()}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="dialog-footer absolute bottom-0 right-0 p-12">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
            <Button
              className="bg-blue-800 hover:bg-blue-700"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

type ScoresheetViewProps = {
  scores: any[]
  doubles: boolean
  fetchName: (player: string) => string
  set: number
  startingIndex: number
}

const ScoresheetView = ({
  scores,
  doubles,
  fetchName,
  set,
  startingIndex,
}: ScoresheetViewProps) => {
  return (
    <div className="overflow-x-auto flex py-2">
      <div className="w-60">
        <div className="p-1">
          <div className="text-sm font-extrabold">{`SET ${set}`}</div>
        </div>
        <div className="border border-slate-800 p-1 h-8">
          <div className="text-sm">{fetchName(doubles ? "a1" : "a2")}</div>
        </div>
        <div className="border border-slate-800 p-1 h-8">
          <div className="text-sm">{fetchName(doubles ? "a2" : "a1")}</div>
        </div>
        <div className="border border-slate-800 p-1 h-8 bg-slate-200">
          <div className="text-sm">{fetchName("b1")}</div>
        </div>
        <div className="border border-slate-800 p-1 h-8 bg-slate-200">
          <div className="text-sm">{fetchName("b2")}</div>
        </div>
      </div>
      <div className="flex">
        {scores.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="p-1">
              <div className="text-center text-xs text-gray-500 py-0.5">
                {index + startingIndex}
              </div>
            </div>
            <div className="border border-slate-700 p-1 w-8 h-8 flex items-center justify-center">
              <div className="text-sm font-bold">
                {item.scorer === (doubles ? "a1" : "a2") &&
                  item.current_a_score}
              </div>
            </div>
            <div className="border border-slate-700 p-1 w-8 h-8 flex items-center justify-center">
              <div className="text-sm font-bold">
                {item.scorer === (doubles ? "a2" : "a1") &&
                  item.current_a_score}
              </div>
            </div>
            <div className="border border-slate-700 p-1 w-8 h-8 flex items-center justify-center bg-slate-200">
              <div className="text-sm font-bold">
                {item.scorer === "b1" && item.current_b_score}
              </div>
            </div>
            <div className="border border-slate-700 p-1 w-8 h-8 flex items-center justify-center bg-slate-200">
              <div className="text-sm font-bold">
                {item.scorer === "b2" && item.current_b_score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Scoresheet

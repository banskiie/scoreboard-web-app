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
import { GAME_FORM_SCHEMA, InitialGameState } from "@/schema"
import { FIRESTORE_DB } from "@/utils/firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore"
import { Loader2 } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Option } from "@/types"
import { Badge } from "@/components/ui/badge"
import { DateTimePicker } from "@/components/custom/date-time-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

const Player = ({ form, loading, player }: any) => {
  return (
    <>
      <div className="flex">
        <span className="font-bold text-lg">Player {player[1]}</span>
        <FormField
          control={form.control}
          name={`players.team_${player[0]}.player_${player[1]}.use_nickname`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-center gap-2 ml-2">
              <FormControl>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={player}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nickname only?
                  </label>
                  <Checkbox
                    id={player}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
      {form.watch(
        `players.team_${player[0]}.player_${player[1]}.use_nickname`
      ) ? (
        <FormField
          control={form.control}
          name={`players.team_${player[0]}.player_${player[1]}.nickname`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder={`Player A${player[1]} - Nickname`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      ) : (
        <>
          <FormField
            control={form.control}
            name={`players.team_${player[0]}.player_${player[1]}.first_name`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={`Player A${player[1]} - First Name`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`players.team_${player[0]}.player_${player[1]}.last_name`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={`Player A${player[1]} - Last Name`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  )
}

const GameForm = ({ id, dialogOpen, dialogClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof GAME_FORM_SCHEMA>>({
    resolver: zodResolver(GAME_FORM_SCHEMA),
    values: data ?? InitialGameState,
  })
  // Options
  const [courts, setCourts] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])
  const [officials, setOfficials] = useState<Option[]>([])

  useEffect(() => {
    setOpen(dialogOpen)
  }, [dialogOpen, setOpen])

  useEffect(() => {
    const courtRef = collection(FIRESTORE_DB, "courts")
    const categoryRef = collection(FIRESTORE_DB, "categories")
    const officialRef = collection(FIRESTORE_DB, "officials")

    const courtSub = onSnapshot(
      query(courtRef, orderBy("created_date", "asc")),
      {
        next: (snapshot) => {
          setCourts(
            snapshot.docs.map((doc: any) => ({
              label: doc.data().court_name,
              value: doc.data().court_name,
            }))
          )
        },
      }
    )

    const categorySub = onSnapshot(
      query(categoryRef, orderBy("created_date", "asc")),
      {
        next: (snapshot) => {
          setCategories(
            snapshot.docs.map((doc: any) => ({
              label: `${doc.data().category_name} (${
                doc.data().category_type
              })`,
              value: `${doc.data().category_name}.${doc.data().category_type}`,
            }))
          )
        },
      }
    )

    const officialSub = onSnapshot(
      query(officialRef, orderBy("created_date", "asc")),
      {
        next: (snapshot) => {
          setOfficials(
            snapshot.docs.map((doc: any) => ({
              label: `${doc.data().first_name} ${doc.data().last_name}`,
              value: `${doc.data().first_name} ${doc.data().last_name}`,
            }))
          )
        },
      }
    )

    return () => {
      courtSub()
      categorySub()
      officialSub()
    }
  }, [])

  useEffect(() => {
    if (id) {
      const fetchGame = async () => {
        try {
          const ref = doc(FIRESTORE_DB, `games/${id}`)
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

      fetchGame()
    }
  }, [id])

  const oneSet = {
    set_1: {
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
  }

  const threeSet = {
    set_1: {
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
    set_2: {
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
    set_3: {
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
  }

  const submit = async (payload: z.infer<typeof GAME_FORM_SCHEMA>) => {
    try {
      console.log(payload)
      setLoading(true)
      if (id) {
        await updateDoc(doc(FIRESTORE_DB, `games/${id}`), payload)
        toast.info("Game Updated")
      } else {
        const setCount = payload.details.no_of_sets
        console.log(setCount)
        await addDoc(collection(FIRESTORE_DB, "games"), {
          ...payload,
          sets: setCount == 1 ? oneSet : threeSet,
          details: {
            ...payload.details,
            created_date: moment().valueOf(),
          },
        })
        toast.success("New Game Added!")
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
      modal={true}
    >
      {!id && (
        <DialogTrigger asChild>
          <Button>Add Game</Button>
        </DialogTrigger>
      )}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[80vw]"
      >
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Game</DialogTitle>
          <DialogDescription>
            Make changes here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col" onSubmit={form.handleSubmit(submit)}>
            <ScrollArea className="h-[65vh] overflow-y-hidden pr-4 -mr-4">
              <div className="grid grid-cols-8 gap-y-3 gap-x-2 pb-4">
                {!!form.watch("time.start") && (
                  <>
                    <div className="col-span-8 flex justify-center">
                      <Badge className="text-center font-bold text-1xl">
                        Settings
                      </Badge>
                    </div>
                    <FormField
                      control={form.control}
                      name="statuses.current"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-1">
                          <FormLabel>
                            Format <b className="text-red-500">*</b>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value.toString()}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder="Select a format"
                                  className="font-bold"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="finished">
                                  Finished
                                </SelectItem>
                                <SelectItem value="upcoming">
                                  Upcoming
                                </SelectItem>
                                <SelectItem value="current">Playing</SelectItem>
                                <SelectItem value="forfeit">
                                  Forfeited
                                </SelectItem>
                                <SelectItem value="no match">
                                  No Match
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time.start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-3">
                          <FormLabel>
                            Time Start <b className="text-red-500">*</b>
                          </FormLabel>
                          <FormControl>
                            <DateTimePicker
                              displayFormat={{ hour12: "MMMM dd, y h:mm a" }}
                              hourCycle={12}
                              value={
                                !!field.value
                                  ? (() => {
                                      switch (typeof field.value) {
                                        case "object":
                                          return moment
                                            .unix(
                                              field.value.nanoseconds / 1000 +
                                                field.value.seconds
                                            )
                                            .toDate()
                                        case "number":
                                          return moment
                                            .unix(field.value)
                                            .toDate()
                                      }
                                    })()
                                  : undefined
                              }
                              onChange={(value) => {
                                field.onChange(moment(value).unix())
                              }}
                              granularity="minute"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time.end"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-3">
                          <FormLabel>
                            Time End <b className="text-red-500">*</b>
                          </FormLabel>
                          <FormControl>
                            <DateTimePicker
                              displayFormat={{ hour12: "MMMM dd, y h:mm a" }}
                              hourCycle={12}
                              value={
                                !!field.value
                                  ? (() => {
                                      switch (typeof field.value) {
                                        case "object":
                                          return moment
                                            .unix(
                                              field.value.nanoseconds / 1000 +
                                                field.value.seconds
                                            )
                                            .toDate()
                                        case "number":
                                          return moment
                                            .unix(field.value)
                                            .toDate()
                                      }
                                    })()
                                  : undefined
                              }
                              onChange={(value) => {
                                field.onChange(moment(value).unix())
                              }}
                              granularity="minute"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="details.shuttles_used"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-1">
                          <FormLabel>
                            Shuttles Used <b className="text-red-500">*</b>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Shuttles Used"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="col-span-8 flex justify-center">
                  <Badge className="text-center font-bold text-1xl">
                    Details
                  </Badge>
                </div>
                <FormField
                  control={form.control}
                  name="details.game_no"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-3">
                      <FormLabel>Game No.</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. R16"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.group_no"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-1">
                      <FormLabel>Group No.</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. 6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.no_of_sets"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2">
                      <FormLabel>
                        Format <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(+value)}
                          value={field.value.toString() as any}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"1"}>Best of 1</SelectItem>
                            <SelectItem value={"3"}>Best of 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.max_score"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2">
                      <FormLabel>
                        Max Score <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Max Score"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          min={1}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time.slot"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>
                        Time Slot <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          displayFormat={{ hour12: "MMMM dd, y h:mm a" }}
                          hourCycle={12}
                          value={
                            !!field.value
                              ? (() => {
                                  switch (typeof field.value) {
                                    case "object":
                                      return moment
                                        .unix(
                                          field.value.nanoseconds / 1000 +
                                            field.value.seconds
                                        )
                                        .toDate()
                                    case "number":
                                      return moment.unix(field.value).toDate()
                                  }
                                })()
                              : undefined
                          }
                          onChange={(value) => {
                            field.onChange(moment(value).unix())
                          }}
                          granularity="minute"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.court"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2">
                      <FormLabel>
                        Court <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a court" />
                          </SelectTrigger>
                          <SelectContent>
                            {courts.map((court: Option, index: number) => (
                              <SelectItem
                                value={court.value as string}
                                key={index}
                              >
                                {court.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2">
                      <FormLabel>
                        Category <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Singles</SelectLabel>
                              {categories
                                .filter(
                                  (category: any) =>
                                    category.value.split(".")[1] === "singles"
                                )
                                .map((category: any, index: number) => {
                                  return (
                                    <SelectItem
                                      value={category.value as string}
                                      key={index}
                                      className="capitalize"
                                    >
                                      {category.label}
                                    </SelectItem>
                                  )
                                })}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Doubles</SelectLabel>
                              {categories
                                .filter(
                                  (category: any) =>
                                    category.value.split(".")[1] === "doubles"
                                )
                                .map((category: any, index: number) => {
                                  return (
                                    <SelectItem
                                      value={category.value as string}
                                      key={index}
                                      className="capitalize"
                                    >
                                      {category.label}
                                    </SelectItem>
                                  )
                                })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <div className="col-span-8 flex justify-center">
                  <Badge className="text-center font-bold text-1xl">
                    Players
                  </Badge>
                </div>
                <FormField
                  control={form.control}
                  name="players.team_a.team_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>Team A Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Team A Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="players.team_b.team_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>Team B Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Team B Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <div className="col-span-4 flex flex-col gap-2.5">
                  <Player form={form} loading={loading} player="a1" />
                  {form.watch("details.category").split(".")[1] ===
                    "doubles" && (
                    <Player form={form} loading={loading} player="a2" />
                  )}
                </div>
                <div className="col-span-4 flex flex-col gap-2.5">
                  <Player form={form} loading={loading} player="b1" />
                  {form.watch("details.category").split(".")[1] ===
                    "doubles" && (
                    <Player form={form} loading={loading} player="b2" />
                  )}
                </div>
                <div className="col-span-8 flex justify-center">
                  <Badge className="text-center font-bold text-1xl">
                    Officials
                  </Badge>
                </div>
                <FormField
                  control={form.control}
                  name="officials.umpire"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>
                        Umpire <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an official" />
                          </SelectTrigger>
                          <SelectContent>
                            {officials.map((official: any, index: number) => {
                              return (
                                <SelectItem
                                  value={official.value as string}
                                  key={index}
                                  className="capitalize"
                                >
                                  {official.label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="officials.service_judge"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>
                        Service Judge <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an official" />
                          </SelectTrigger>
                          <SelectContent>
                            {officials.map((official: any, index: number) => {
                              return (
                                <SelectItem
                                  value={official.value as string}
                                  key={index}
                                  className="capitalize"
                                >
                                  {official.label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="officials.referee"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4">
                      <FormLabel>
                        Referee <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an official" />
                          </SelectTrigger>
                          <SelectContent>
                            {officials.map((official: any, index: number) => {
                              return (
                                <SelectItem
                                  value={official.value as string}
                                  key={index}
                                  className="capitalize"
                                >
                                  {official.label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-3 border-t-[1px] ">
              <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="min-w-20" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
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

export default GameForm

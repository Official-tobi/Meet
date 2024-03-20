import { useEffect, useState } from "react";
import "./App.css";
import { Calendar } from "./components/ui/calendar";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Skeleton } from "./components/ui/skeleton";
import { formatDateStr, formatTimeStr } from "./utils/formatter";
import filter from "./utils/filter";
import hours from "./utils/hours";
import Payload from "./utils/types/data";
import fetcher, { feedback } from "./utils/fetcher";

function App() {
  // Date state passed into the calendar component and is mutated by the calendar component
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Data state the holds the payload from the fetch statement
  const [data, setData] = useState<Payload[]>([]);
  // isOpen holds the state for the opening and closing of the dialog compoennts
  const [isOpen, setIsOpen] = useState<boolean>();
  // loading state for when the fetch request is fired
  const [loading, setLoading] = useState<boolean>(false);
  // This holds the users available time obtained by filtering the hours state with the data recieved
  const [freeTimeInt, setFreeTimeInt] = useState<string[]>([]);

  // Fires a fetch request when the date changes
  useEffect(() => {
    if (date) {
      console.log("fetching schedule...");
      const dateString = formatDateStr(date);
      if (dateString === formatDateStr(new Date())) {
        // fetcher() called without dateString instantiates a new date object within the function
        fetcher(setLoading, setData);
      } else {
        // fetcher() called with the dateString utilises the date string
        fetcher(setLoading, setData, dateString);
      }
    } else {
      feedback(
        "No date selected",
        "To see a daily schedule, a date must be selected",
        "close"
      );
    }
  }, [date]);

  // This observes the changes in the data state and updates the setFreeTimeInt state with the filtered hours
  useEffect(() => {
    //This empties the free hours array each time the data state changes, so that it doesn't hold the value from a previous fetch
    setFreeTimeInt([]);
    // This takes in the working hours, start time and end time and returns an array excluding the start time, the end time and all the values in between. Note: that hours array must contain the working hours in the right order from morning to evening else it will introduce a bug.
    if (data.length === 0) {
      setFreeTimeInt(hours);
    } else {
      data.forEach((val) => {
        setFreeTimeInt((prevVal) => [
          ...prevVal,
          ...filter(hours, formatTimeStr(val.start), formatTimeStr(val.end)),
        ]);
      });
    }
  }, [data]);

  return (
    <main className="font-inter grid grid-cols-2 gap-20 h-full items-center font-semibold">
      <div className="absolute">
        <Toaster position="top-center" />
      </div>
      <section>
        <Calendar
          className="scale-125"
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </section>
      <section>
        {date && <p className="w-[30ch] py-4">{date?.toString()}</p>}

        {date ? (
          <div className={` w-[30ch]`}>
            {loading ? (
              <div className="grid grid-cols-3 gap-2 w-full">
                {hours.map((_, index) => {
                  return <Skeleton key={index} className="w-full h-10" />;
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 w-full">
                {freeTimeInt ? (
                  freeTimeInt.map((hour, index) => {
                    return (
                      <Dialog
                        key={index}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="secondary">
                            {/* this statement cuts of the seconds portion of the time string */}
                            {hour.substring(0, hour.length - 3)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              Do you want to schedule this event at this time
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose>
                              <span
                                className={`h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                              >
                                Cancel
                              </span>
                            </DialogClose>
                            <Dialog>
                              <DialogTrigger>
                                <span
                                  className={`h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                                >
                                  Schedule
                                </span>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Schedule your Meeting
                                  </DialogTitle>
                                  <DialogDescription>
                                    Enter the details of the meeting below
                                  </DialogDescription>
                                </DialogHeader>

                                <Input
                                  type="text"
                                  placeholder="Event name (e.g. Annual Breakdown)"
                                />
                                <DialogFooter>
                                  <Button
                                    variant={`default`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    Schedule Meeting
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    );
                  })
                ) : (
                  <div>
                    {hours.map((hour, index) => {
                      return (
                        <Button key={index} variant={`secondary`}>
                          {/* this statement cuts of the seconds portion of the time string */}
                          {hour.substring(0, hour.length - 3)}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="select-none opacity-55">Please select a date</p>
        )}
      </section>
    </main>
  );
}

export default App;

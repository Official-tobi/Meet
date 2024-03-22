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
import { Payload, Request } from "./utils/types/data";
import fetcher, { feedback } from "./utils/fetcher";
// import updateSchedule from "./utils/updater";

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
  // Holds the value for a selected start Time and resolves the corresponding end time
  const [request, setRequest] = useState<Request>();

  // The handleSchedule function automatically resolves the startTime and endTime for any selected time and updates the request state
  const handleSchedule = (hour: string) => {
    // For debugging: to see that the hour is successfully passed in to the function
    // console.log(hour);
    // For dubugging: Expression test to see whether we can return the index of the element following the selected one in the array
    // console.log(hours.indexOf(hour) + 1);
    // Compares both the hours array and the availble hours array i.e. freeTimeInt to see if the element following the selected element is thesame in both. If not it means that element is used in another interval i.e. has been scheduled and it selects the element before the selected element as the startTime and the selected element as the endTime
    if (
      hours[hours.indexOf(hour) + 1] ===
      freeTimeInt[freeTimeInt.indexOf(hour) + 1]
    ) {
      const request: Request = {
        startTime: hour,
        endTime: hours[hours.indexOf(hour) + 1],
      };
      // console.log(request);
      setRequest(request);
    } else {
      const request: Request = {
        startTime: hours[hours.indexOf(hour) - 1],
        endTime: hour,
      };
      // console.log(request);
      setRequest(request);
    }
  };

  // Fires a fetch request when the date changes
  useEffect(() => {
    if (date) {
      const dateString = formatDateStr(date);
      if (dateString === formatDateStr(new Date())) {
        // fetcher() called without dateString instantiates a new date object within the function
        fetcher(setLoading, setData);
      } else {
        // fetcher() called with the dateString utilises the date string parameter
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

  // This was intended to send data to update the backend when a time is selected
  useEffect(() => {
    // console.log(request);
  }, [request]);
  // updateSchedule();
  return (
    <main className="py-24 md:py-0 font-inter grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20 h-full items-center font-semibold">
      <div className="absolute">
        <Toaster position="top-center" />
      </div>
      <section className="grid justify-center">
        <Calendar
          className="scale-110 md:scale-125 "
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </section>
      <section className="grid justify-center">
        {date && (
          <p className="text-center md:text-left w-[30ch] py-4">
            {date?.toString()}
          </p>
        )}

        {date ? (
          <div className={`w-[30ch]`}>
            {loading ? (
              <div className="grid grid-cols-3 gap-2">
                {hours.map((_, index) => {
                  return <Skeleton key={index} className="w-full h-10" />;
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {freeTimeInt ? (
                  freeTimeInt.map((hour, index) => {
                    return (
                      <Dialog
                        key={index}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            onClick={() => handleSchedule(hour)}
                          >
                            {/* this statement cuts of the seconds portion of the time string */}
                            {hour.substring(0, hour.length - 3)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-4/5">
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              Do you want to schedule this event at this time
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="grid grid-cols-2 sm:flex sm:justify-end">
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

                              <DialogContent className="w-4/5 md:w-full">
                                <DialogHeader>
                                  <DialogTitle>
                                    Schedule your Meeting
                                  </DialogTitle>
                                  <DialogDescription>
                                    Enter the details of the meeting below
                                  </DialogDescription>
                                </DialogHeader>

                                <Input
                                  id="event"
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

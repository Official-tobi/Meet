import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";
import { Calendar } from "./components/ui/calendar";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Type for payload data
interface Payload {
  start: string;
  end: string;
  showAs: string;
  isBusyAllDay: boolean;
}
// This array contains all the available working hours in the right order from 7AM to 6PM
// The hours array must always contain the hours in ascending order
const hours: string[] = [
  "06:00:00",
  "06:30:00",
  "07:00:00",
  "07:30:00",
  "08:00:00",
  "08:30:00",
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
  "17:00:00",
  "17:30:00",
  "18:00:00",
];
const filter = (timeInt: string[], startTime: string, endTime: string) => {
  const startTimeIndex = timeInt.indexOf(startTime);
  const endTimeIndex = timeInt.indexOf(endTime);

  if (startTimeIndex == -1 || endTimeIndex == -1) {
    return [];
  }

  const start = Math.min(startTimeIndex, endTimeIndex);
  const end = Math.max(startTimeIndex, endTimeIndex);

  return timeInt.slice(start, end + 1);
};
function App() {
  // Date state passed into the calendar component and is mutated by the calendar component
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Data state the holds the payload from the fetch statement
  const [data, setData] = useState<Payload[]>([]);

  // This holds the users available time obtained by filtering the hours state with the data recieved
  const [freeTimeInt, setFreeTimeInt] = useState<string[]>([]);

  // This prepares the date state to be sent to the backend
  const formatDateStr = (date: Date) => {
    return `${date?.getFullYear()}-${
      date?.getMonth() + 1 < 10
        ? "0" + (date?.getMonth() + 1)
        : date.getMonth() + 1
    }-${date?.getDate()}`;
  };
  // This prepares the date & time stat to be sent to the backend
  // const formatDateTimeStr = (date: Date) => {
  //   const dateStr = formatDateStr(date);
  //   const timeStr = date.toString().split(" ")[4];
  //   return `${dateStr}%20${timeStr}`;
  // };
  // Fires a fetch request when the date changes
  useEffect(() => {
    if (date) {
      console.log("fetching schedule...");

      const dateString = formatDateStr(date);

      const fetchFullday = async (dateStr: string) => {
        try {
          const res = await fetch(
            `https://motex-web-services.onrender.com/api/v1/book-demo/calendar?startTime=${dateStr}%2000:00:00&endTime=${dateStr}%2023:59:59`
          );
          if (!res.ok) {
            const err = await res.json();
            toast(`Error Code ${400}`, {
              description: `${err.message}`,
              action: {
                label: "close",
                onClick: () => {},
              },
            });
            throw new Error(`Bad Request [${res.status}]`);
          }

          const data = await res.json();
          setData(data.payload);
          toast(`${data.message}}`, {
            description: `The unoccupied times have been displayed below`,
          });
          console.log("fetching done!");
        } catch (error) {
          console.warn(error);
          console.log("fetching done!");
        }
      };

      fetchFullday(dateString);
    } else {
      toast("No date selected", {
        description: "To see a daily schedule, a date must be selected",
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });
    }
  }, [date]);

  // This takes in the start and end returned by the backend and formats for usage
  const formatTime = (time: string) => time.split("T")[1].split(".")[0];

  // This observes the changes in the data state and updates the setFreeTimeInt state with the filtered hours
  useEffect(() => {
    //This empties the free hours array each time the data state changes, so that it doesn't hold the value from a previous fetch
    setFreeTimeInt([]);
    // This takes in the working hours, start time and end time and returns an array containing the start time the end time and all the values in between
    if (data.length === 0) {
      setFreeTimeInt(hours);
    } else {
      data.forEach((val) => {
        setFreeTimeInt((prevVal) => [
          ...prevVal,
          ...filter(hours, formatTime(val.start), formatTime(val.end)),
        ]);
      });
    }
  }, [data]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="font-inter w-full grid grid-cols-2 gap-36 h-full items-center font-semibold">
        <div className="absolute grid place-items-center">
          <Toaster position="top-center" />
        </div>
        <section className="justify-self-end">
          <Calendar
            className="scale-125 p-0"
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </section>
        <section className="justify-self-start">
          {date && <p className="w-[30ch] py-4">{date?.toString()}</p>}

          {date ? (
            <div className={`grid grid-cols-3 gap-2 w-[30ch]`}>
              {freeTimeInt ? (
                freeTimeInt.map((hour, index) => {
                  return (
                    <Button key={index} variant="secondary">
                      {/* this statement cuts of the seconds portion of the time string */}
                      {hour.substring(0, hour.length - 3)}
                    </Button>
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
          ) : (
            <p className=" select-none opacity-55">Please select a date</p>
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;

import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";
import { Calendar } from "./components/ui/calendar";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

interface Payload {
  start: string;
  end: string;
  showAs: string;
  isBusyAllDay: boolean;
}

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<Payload[]>([]);
  const hours: string[] = [
    "6:00:00",
    "6:30:00",
    "7:00:00",
    "7:30:00",
    "8:00:00",
    "8:30:00",
    "9:00:00",
    "9:30:00",
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
  useEffect(() => {
    if (date) {
      console.log("fetching schedule...");
      const dateString = `${date?.getFullYear()}-${
        date?.getMonth() + 1 < 10
          ? "0" + (date?.getMonth() + 1)
          : date.getMonth() + 1
      }-${date?.getDate()}`;

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
          console.log(data);
          const message = data.message;
          setData(data.payload);
          toast(`${message}}`, {
            description: `The available times have been displayed below`,
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
  console.log(data);
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
              {hours.map((hour, index) => {
                return (
                  <Button key={index} variant="secondary">
                    {hour.substring(0, hour.length - 3)}
                  </Button>
                );
              })}
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

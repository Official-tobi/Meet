import { formatDateStr, formatDateTimeStr } from "./formatter";
import Payload from "./types/data";
import { toast } from "sonner";

// ResponseError, which extends the built-in Error class. The purpose of this custom class is to create error objects that also contain a reference to an HTTP response object

class ResponseError extends Error {
  response: Response;
  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}
// A wrapper over the toast component that simplifies the usage
export const feedback = (
  title: string,
  description: string,
  label?: string
) => {
  if (label) {
    toast(title, { description, action: { label, onClick: () => {} } });
  } else {
    toast(title, { description });
  }
};

const fetcher = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setData: React.Dispatch<React.SetStateAction<Payload[]>>,
  dateStr?: string
) => {
  setLoading(true);
  try {
    const res = await fetch(
      `https://motex-web-services.onrender.com/api/v1/book-demo/calendar?startTime=${
        dateStr ? `${dateStr}%2000:00:00` : formatDateTimeStr(new Date())
      }&endTime=${dateStr ? dateStr : formatDateStr(new Date())}%2023:59:59`
    );
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData.message);
      throw new ResponseError(`Bad fetch response`, res);
    }
    const data = await res.json();

    setData(data.payload);
    setLoading(false);
    feedback(
      "Daily free hours successfully retrieved",
      "The available hours are displayed below, select to schedule",
      "close"
    );
  } catch (error) {
    const responseError = error as ResponseError;
    console.error(responseError);
    setLoading(false);
    feedback(
      `Error fetching free hours ${responseError.response.status}`,
      `Can't schedule events in the past`,
      "close"
    );
  }
};

export default fetcher;

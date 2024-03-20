// This prepares the date state to be sent to the backend
export const formatDateStr = (date: Date) => {
  return `${date?.getFullYear()}-${
    date?.getMonth() + 1 < 10
      ? "0" + (date?.getMonth() + 1)
      : date.getMonth() + 1
  }-${date?.getDate()}`;
};
// This prepares the date & time stat to be sent to the backend
export const formatDateTimeStr = (date: Date) => {
  const dateStr = formatDateStr(date);
  const timeStr = date.toString().split(" ")[4];
  return `${dateStr}%20${timeStr}`;
};
// This takes in the start and end returned by the backend and formats for usage
export const formatTimeStr = (time: string) => time.split("T")[1].split(".")[0];

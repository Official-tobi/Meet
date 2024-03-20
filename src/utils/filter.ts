// Takes in a start time and end time and returns an array exluding the start time and the end time and all the values in between
const filter = (timeInt: string[], startTime: string, endTime: string) => {
  const startTimeIndex = timeInt.indexOf(startTime);
  const endTimeIndex = timeInt.indexOf(endTime);

  if (startTimeIndex == -1 || endTimeIndex == -1) {
    return [];
  }

  const start = Math.min(startTimeIndex, endTimeIndex);
  const end = Math.max(startTimeIndex, endTimeIndex);

  const availableHours = timeInt.filter(
    (_, index) => index < start || index > end
  );
  return availableHours;
};
export default filter;

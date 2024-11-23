import { parse, getDay } from "date-fns";

const getWeekdayFromDate = (s) => {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = parse(s, "dd/MM/yyyy", new Date());
  const dayOfWeek = getDay(date);
  return weekdayNames[dayOfWeek];
};

export default getWeekdayFromDate;

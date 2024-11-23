import { parse, format, eachDayOfInterval } from "date-fns";

const parseInputDates = (s, e) => {
  const startDate = parse(s, "yyyy-MM-dd", new Date());
  const endDate = parse(e, "yyyy-MM-dd", new Date());

  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  return dates.map((date) => format(date, "dd/MM/yyyy"));
};

export default parseInputDates;

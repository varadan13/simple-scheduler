import parseInputDates from "./parseInputDates";
import getWeekdayFromDate from "./getWeekdayFromDate";
import {
  getShldComputeOverlappingSlots,
  transformSelectedSlots,
  findOverlappingSlots,
  timeToMinutes,
} from "./backendUtils";

const checkParticipantAvailableSlots = async ({
  selectedParticipants,
  date_range,
}) => {
  const res1 = await fetch("http://localhost:3000/api/get-all-availability");
  const participantAvailability = await res1.json();

  const res2 = await fetch("http://localhost:3000/api/get-all-schedule");
  const schedules = await res2.json();

  const dates = parseInputDates(date_range.start, date_range.end);
  const selectedIds = selectedParticipants.map((ele) => ele.id);

  const temp = {};
  for (let date of dates) {
    const selectedDate = date;
    const selectedDay = getWeekdayFromDate(date);

    const getParticipantsThresholds = () => {
      return selectedIds.map(
        (id) => selectedParticipants.find((ele) => ele.id === id).threshold
      );
    };

    const getParticipantsAvailabilitySlots = () => {
      return selectedIds
        .map((id) => participantAvailability[id][selectedDay])
        .filter((ele) => !!ele);
    };

    const getParticipantsSchedules = () => {
      return selectedIds
        .map((id) => (schedules[id] ?? {})[selectedDate])
        .filter((sch) => !!sch)
        .flat(1)
        .map((sch) => [timeToMinutes(sch.start), timeToMinutes(sch.end)]);
    };

    const getParticipantsScheduleCount = () => {
      return selectedIds
        .map((id) => (schedules[id] ?? {})[selectedDate])
        .map((sch) => (sch ? sch.length : 0));
    };

    const participantsAvailabilitySlots = getParticipantsAvailabilitySlots();

    if (participantsAvailabilitySlots.length === 0) {
      temp[selectedDate] = [];
    } else {
      const participantsThresholds = getParticipantsThresholds();
      const participantsSchedules = getParticipantsSchedules();
      const participantsScheduleCount = getParticipantsScheduleCount();

      const shldComputeOverlappingSlots = getShldComputeOverlappingSlots(
        participantsScheduleCount,
        participantsThresholds
      );

      if (shldComputeOverlappingSlots) {
        const overlappingSlots = findOverlappingSlots(
          transformSelectedSlots(participantsAvailabilitySlots),
          participantsSchedules
        );

        temp[selectedDate] = overlappingSlots;
      } else {
        temp[selectedDate] = [];
      }
    }
  }

  return temp;
};

export default checkParticipantAvailableSlots;

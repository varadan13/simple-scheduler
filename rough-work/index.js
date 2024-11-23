import data from "./data.js";
import {
  getShldComputeOverlappingSlots,
  transformSelectedSlots,
  findOverlappingSlots,
  timeToMinutes,
} from "./utils.js";

const selectedIds = [1, 2, 3];

const selectedDate = "28/10/2024";

const selectedDay = "Monday"; // use lib

const getParticipantsThresholds = () => {
  const { participants } = data;
  return selectedIds.map((id) => participants[id].threshold);
};

const getParticipantsAvailabilitySlots = () => {
  const { participantAvailability } = data;
  return selectedIds.map((id) => participantAvailability[id][selectedDay]);
};

const getParticipantsSchedules = () => {
  const { schedules } = data;
  return selectedIds
    .map((id) => (schedules[id] ?? {})[selectedDate])
    .filter((sch) => !!sch)
    .flat(1)
    .map((sch) => [timeToMinutes(sch.start), timeToMinutes(sch.end)]);
};

const getParticipantsScheduleCount = () => {
  const { schedules } = data;
  return selectedIds
    .map((id) => (schedules[id] ?? {})[selectedDate])
    .map((sch) => (sch ? sch.length : 0));
};

const participantsThresholds = getParticipantsThresholds();
const participantsAvailabilitySlots = getParticipantsAvailabilitySlots();
const participantsSchedules = getParticipantsSchedules();
const participantsScheduleCount = getParticipantsScheduleCount();

const shldComputeOverlappingSlots = getShldComputeOverlappingSlots(
  participantsScheduleCount,
  participantsThresholds
);

const index = () => {
  if (shldComputeOverlappingSlots) {
    const overlappingSlots = findOverlappingSlots(
      transformSelectedSlots(participantsAvailabilitySlots),
      participantsSchedules
    );
    console.log(overlappingSlots);
  }
};

index();

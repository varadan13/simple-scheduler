import data from "./data.js";
import {
  getShldComputeOverlappingSlots,
  transformSelectedSlots,
  findOverlappingSlots,
} from "./utils.js";

const selectedIds = [1, 2, 3];

const selectedData = "28/10/2024";

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
    .map((id) => (schedules[id] ?? {})[selectedData])
    .filter((sch) => !!sch)
    .flat(1);
};

const getParticipantsScheduleCount = () => {
  const { schedules } = data;
  return selectedIds
    .map((id) => (schedules[id] ?? {})[selectedData])
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
      transformSelectedSlots(participantsAvailabilitySlots)
    );
    console.log(overlappingSlots);
  }
};

index();

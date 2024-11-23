export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const transformSelectedSlots = (selectedSlots) => {
  const temp = [];
  selectedSlots.forEach((slots) => {
    temp.push(
      slots.map((slt) => [timeToMinutes(slt.start), timeToMinutes(slt.end)])
    );
  });
  return temp;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const getSlots = (transformedSlots) => {
  const temp = [];
  transformedSlots.forEach((slots) => {
    temp.push(
      slots.map((slt) => ({
        start: minutesToTime(slt[0]),
        end: minutesToTime(slt[1]),
      }))
    );
  });
  return temp;
};

export const getShldComputeOverlappingSlots = (
  numberOfExistingSchedule,
  threshold
) => numberOfExistingSchedule.every((ele, idx) => ele < threshold[idx]);

function generateHalfHourIntervals(timeSlots) {
  const intervals = [];

  timeSlots.forEach((slot) => {
    const startTime = new Date(`1970-01-01T${slot[0]}:00`);
    const endTime = new Date(`1970-01-01T${slot[1]}:00`);

    while (startTime < endTime) {
      const nextTime = new Date(startTime.getTime() + 30 * 60000);
      intervals.push([
        startTime.toTimeString().slice(0, 5),
        nextTime.toTimeString().slice(0, 5),
      ]);
      startTime.setTime(nextTime.getTime());
    }
  });

  return intervals;
}

export const findOverlappingSlots = (slots, existingSchedules) => {
  for (let i = 0; i < slots.length; i++) {
    slots[i].sort((a, b) => a[0] - b[0]);
  }

  const pointers = new Array(slots.length).fill(0);
  const temp = [];

  while (true) {
    const currentSlots = pointers.map((pointer, index) => {
      return pointer < slots[index].length ? slots[index][pointer] : null;
    });

    if (currentSlots.some((slot) => slot === null)) break;

    const start = Math.max(...currentSlots.map((slot) => slot[0]));
    const end = Math.min(...currentSlots.map((slot) => slot[1]));

    if (start < end) {
      if (existingSchedules.some((eSch) => eSch[0] > start && eSch[1] < end)) {
        // pass
      } else {
        temp.push([start, end]);
      }
    }

    let minEndIndex = currentSlots.reduce((minIndex, slot, index) => {
      if (slot && (minIndex === null || slot[1] < currentSlots[minIndex][1])) {
        return index;
      }
      return minIndex;
    }, null);

    pointers[minEndIndex]++;
  }

  return generateHalfHourIntervals(
    temp.map((slt) => [minutesToTime(slt[0]), minutesToTime(slt[1])])
  );
};

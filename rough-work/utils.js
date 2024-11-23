const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const transformSelectedSlots = (selectedSlots) => {
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

const shldComputeOverlappingSlots = (numberOfExistingSchedule, threshold) =>
  numberOfExistingSchedule.every((ele, idx) => ele < threshold[idx]);

const findOverlappingSlots = (slots) => {
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
      temp.push([start, end]);
    }

    let minEndIndex = currentSlots.reduce((minIndex, slot, index) => {
      if (slot && (minIndex === null || slot[1] < currentSlots[minIndex][1])) {
        return index;
      }
      return minIndex;
    }, null);

    pointers[minEndIndex]++;
  }

  return temp.map((slt) => ({
    start: minutesToTime(slt[0]),
    end: minutesToTime(slt[1]),
  }));
};

// func that handles threshold complexity

// func to break it down into half an hour slot

const scheduleArray = [
  [
    { start: "09:30", end: "10:30" },
    {
      start: "15:00",
      end: "16:30",
    },
  ],
];

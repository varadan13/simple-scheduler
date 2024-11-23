"use client";

import { useCallback } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import safeJsonParse from "@/utils/safeJsonParse";
import checkParticipantAvailableSlots from "@/utils/checkParticipantAvailableSlots";
import FormUI from "./FormUI";

const BookingForm = ({ participantsList }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  let selectedParticipants = searchParams.get("selectedParticipants");

  selectedParticipants = selectedParticipants
    ? safeJsonParse(atob(selectedParticipants))
    : [];

  let startDate = searchParams.get("startDate");

  startDate = startDate ?? "";

  let endDate = searchParams.get("endDate");

  endDate = endDate ?? "";

  const handleParticipantChange = (selectedOptions) => {
    router.push(
      pathname +
        "?" +
        createQueryString(
          "selectedParticipants",
          btoa(JSON.stringify(selectedOptions))
        )
    );
  };

  const setStartDate = (value) => {
    router.push(pathname + "?" + createQueryString("startDate", value));
  };

  const setEndDate = (value) => {
    router.push(pathname + "?" + createQueryString("endDate", value));
  };

  console.log({ selectedParticipants, startDate, endDate });

  const checkSlots = async () => {
    const res = await checkParticipantAvailableSlots({
      selectedParticipants,
      date_range: { start: startDate, end: endDate },
    });
  };

  return (
    <>
      <FormUI
        participantsList={participantsList}
        handleParticipantChange={handleParticipantChange}
        selectedParticipants={selectedParticipants}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        checkSlots={checkSlots}
      />
    </>
  );
};

export default BookingForm;

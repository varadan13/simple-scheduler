"use client";

import { useCallback, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import safeJsonParse from "@/utils/safeJsonParse";
import checkParticipantAvailableSlots from "@/utils/checkParticipantAvailableSlots";
import FormUI from "./FormUI";

const BookingForm = ({ participantsList }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState(null);

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

  const checkSlots = async () => {
    setLoading(true);
    setSlots(null);
    const res = await checkParticipantAvailableSlots({
      selectedParticipants,
      date_range: { start: startDate, end: endDate },
    });
    setSlots(res);
    setLoading(false);
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
        loading={loading}
      />
      {slots && (
        <>
          <div className="m-6" />
          <p className="text-center text-black">Available Slots</p>
          <div className="max-w-md m-auto p-6 bg-white rounded-lg shadow-md">
            {Object.keys(slots).map((ele1) => (
              <div key={ele1}>
                <p className="font-medium text-black">{ele1}:</p>
                <div>
                  {slots[ele1].map((ele2) => (
                    <button
                      key={ele2}
                      className="m-4 text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      {`${ele2[0]}-${ele2[1]}`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default BookingForm;

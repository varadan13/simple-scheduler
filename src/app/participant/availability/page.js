import React from "react";
import BookingForm from "@/components/BookingForm";

const Index = async () => {
  let participants = await fetch(
    "http://localhost:3000/api/get-all-participants"
  );
  participants = await participants.json();

  return <BookingForm participantsList={participants} />;
};

export default Index;

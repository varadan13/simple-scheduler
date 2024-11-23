import Select from "react-select";

const FormUI = ({
  participantsList,
  handleParticipantChange,
  selectedParticipants,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  checkSlots,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl text-black font-bold mb-4">Booking Form</h2>

      <div className="mb-4">
        <label className="block text-black mb-2">Select Participants</label>
        <Select
          value={selectedParticipants}
          className=" text-black "
          isMulti
          options={participantsList}
          onChange={handleParticipantChange}
          classNamePrefix="select"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-black font-semibold">
          Selected Participants:
        </h3>
        <ul>
          {selectedParticipants.map((participant) => (
            <li key={participant.value} className="text-black-700">
              {participant.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-black mb-2">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border text-black border-gray-300 rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black mb-2">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border text-black border-gray-300 rounded p-2 w-full"
        />
      </div>

      <button
        onClick={checkSlots}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Check Slot
      </button>
    </div>
  );
};

export default FormUI;

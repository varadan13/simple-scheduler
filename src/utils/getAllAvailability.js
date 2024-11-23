import redis from "./redis";

// Function to get participant availability
async function getParticipantAvailability() {
  const pattern = "availability:*"; // Pattern to match all availability keys
  let cursor = "0"; // Start cursor for SCAN
  const availabilityData = {};

  do {
    // Use SCAN to get matching keys
    const result = await redis.scan(cursor, "MATCH", pattern);
    cursor = result[0]; // Update cursor for the next iteration
    const keys = result[1]; // Get the matched keys

    // Fetch values for each key and format them
    for (const key of keys) {
      const value = await redis.get(key); // Assuming values are stored as JSON strings

      // Extracting parts from the key
      const parts = key.split(":"); // Split key to get participant ID and day
      const participantId = parts[1]; // Participant ID is the second part of the key
      const day = parts[2]; // Day is the third part of the key

      // Initialize participant object if it doesn't exist
      if (!availabilityData[participantId]) {
        availabilityData[participantId] = {};
      }

      // Initialize day array if it doesn't exist
      if (!availabilityData[participantId][day]) {
        availabilityData[participantId][day] = [];
      }

      // Parse value and push it into the corresponding day array
      availabilityData[participantId][day].push(JSON.parse(value)); // Assuming value is stored as JSON string
    }
  } while (cursor !== "0"); // Continue until cursor is back to 0

  return availabilityData;
}

// Example usage
getParticipantAvailability()
  .then((data) => console.log(JSON.stringify(data, null, 2))) // Pretty print JSON output
  .catch((err) =>
    console.error("Error fetching participant availability:", err)
  );

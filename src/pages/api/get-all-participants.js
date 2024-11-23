import redis from "@/utils/redis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const participants = [];

      const participantIds = await redis.smembers("participant_ids");

      for (const id of participantIds) {
        const participantKey = `participant:${id}`;
        const participantData = await redis.hgetall(participantKey);

        if (participantData) {
          participantData.id = id;
          participantData.label = participantData.name;
          participantData.value = participantData.name;
          participants.push(participantData);
        }
      }
      return res.status(200).json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Failed to fetch participants." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}

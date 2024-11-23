import redis from "@/utils/redis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const participantSchedules = {};

      const participantIds = await redis.smembers("participant_ids");

      for (const id of participantIds) {
        const [, keys] = await redis.scan(0, {
          match: `schedule:${id}:*`,
        });

        console.log(keys);
        for (const key of keys) {
          const [, , day] = key.split(":");

          const value = await redis.get(`schedule:${id}:${day}`);
          if (participantSchedules[id]) {
            participantSchedules[id][day] = value;
          } else {
            participantSchedules[id] = {};
            participantSchedules[id][day] = value;
          }
        }
      }
      return res.status(200).json(participantSchedules);
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Failed to fetch participants." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}

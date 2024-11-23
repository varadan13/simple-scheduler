const safeJsonParse = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
};

export default safeJsonParse;

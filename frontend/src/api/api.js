const BASE_URL = "http://127.0.0.1:8000";

export const analyzeJob = async (formData) => {
  const res = await fetch(`${BASE_URL}/analyze-job`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const getProgress = async () => {
  const res = await fetch(`${BASE_URL}/progress`);
  return res.json();
};
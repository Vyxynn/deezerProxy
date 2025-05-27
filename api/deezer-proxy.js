import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith("https://api.deezer.com/")) {
    res.status(400).json({ error: "Invalid or missing 'url' parameter." });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: "Deezer API error." });
      return;
    }
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed", details: error.message });
  }
}

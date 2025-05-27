import fetch from "node-fetch";

export default async function handler(req, res) {
  // Expect a 'url' query param with full Deezer API endpoint URL
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

    // CORS headers so your frontend can use it without browser blocking
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed", details: error.message });
  }
}

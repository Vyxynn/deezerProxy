import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  // Basic validation: only allow Deezer API URLs for safety
  if (!url || !url.startsWith("https://api.deezer.com/")) {
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: "Deezer API error" });
      return;
    }
    const data = await response.json();

    // Add CORS headers to allow any site to fetch from this proxy
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
}

const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://api.deezer.com/')) {
    return res.status(400).json({ error: "Invalid or missing 'url' parameter" });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Deezer API error' });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
};

const fetch = require('node-fetch');

async function fetchWithRetries(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 500)); // delay before retry
    }
  }
}

module.exports = async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://api.deezer.com/')) {
    return res.status(400).json({ error: "Invalid or missing 'url' parameter" });
  }

  try {
    const data = await fetchWithRetries(url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
};

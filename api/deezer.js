const https = require('https');

module.exports = async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end(); // No content for preflight
  }

  const { url } = req.query;

  if (!url || !url.startsWith('https://api.deezer.com/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: "Invalid or missing 'url' parameter" });
  }

  // Set CORS and content-type headers BEFORE making the proxy request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  https.get(url, (response) => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        res.status(200).json(json);
      } catch (e) {
        console.error('JSON parse error:', e);
        res.status(500).json({ error: 'Failed to parse JSON from Deezer' });
      }
    });
  }).on('error', (e) => {
    console.error('HTTPS proxy error:', e);
    res.status(500).json({ error: 'Proxy fetch failed', details: e.message });
  });
};

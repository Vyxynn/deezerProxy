const https = require('https');

module.exports = async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://api.deezer.com/')) {
    return res.status(400).json({ error: "Invalid or missing 'url' parameter" });
  }

  https.get(url, (response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

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

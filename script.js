const proxyBase = "https://deezer-proxy-psi.vercel.app/";

async function fetchDeezerArtistImage(artistName) {
  if (!artistName) return null;
  const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`;
  const res = await fetch(`${proxyBase}?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    console.warn("Proxy fetch failed for artist image");
    return null;
  }
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].picture_medium;
  }
  return null;
}

async function fetchDeezerTrackInfo(trackTitle, artistName) {
  if (!trackTitle || !artistName) return null;
  const url = `https://api.deezer.com/search?q=track:"${encodeURIComponent(trackTitle)}" artist:"${encodeURIComponent(artistName)}"`;
  const res = await fetch(`${proxyBase}?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    console.warn("Proxy fetch failed for track info");
    return null;
  }
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    const track = data.data[0];
    return {
      albumCover: track.album.cover_medium,
      albumName: track.album.title,
      trackTitle: track.title,
      artistName: track.artist.name
    };
  }
  return null;
}

document.getElementById("artist-search-btn").addEventListener("click", async () => {
  const artistInput = document.getElementById("artist-input").value.trim();
  const resultDiv = document.getElementById("artist-result");
  resultDiv.innerHTML = "Loading...";
  const imgUrl = await fetchDeezerArtistImage(artistInput);
  if (imgUrl) {
    resultDiv.innerHTML = `<img src="${imgUrl}" alt="${artistInput}">`;
  } else {
    resultDiv.textContent = "No artist image found.";
  }
});

document.getElementById("track-search-btn").addEventListener("click", async () => {
  const trackTitle = document.getElementById("track-title").value.trim();
  const artistName = document.getElementById("track-artist").value.trim();
  const resultDiv = document.getElementById("track-result");
  resultDiv.innerHTML = "Loading...";
  const info = await fetchDeezerTrackInfo(trackTitle, artistName);
  if (info) {
    resultDiv.innerHTML = `
      <img src="${info.albumCover}" alt="${info.albumName}" />
      <p><strong>Track:</strong> ${info.trackTitle}</p>
      <p><strong>Artist:</strong> ${info.artistName}</p>
      <p><strong>Album:</strong> ${info.albumName}</p>
    `;
  } else {
    resultDiv.textContent = "No track info found.";
  }
});

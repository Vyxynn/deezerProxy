// CHANGE THIS to your deployed Vercel project URL:
const proxyBase = "https://deezer-proxy-psi.vercel.app/api/deezer";

async function fetchFromProxy(deezerUrl) {
  const encodedUrl = encodeURIComponent(deezerUrl);
  const res = await fetch(`${proxyBase}?url=${encodedUrl}`);
  if (!res.ok) {
    throw new Error(`Proxy error: ${res.status}`);
  }
  return res.json();
}

async function getArtistImage(artistName) {
  if (!artistName) return null;
  const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`;
  const data = await fetchFromProxy(url);
  if (data.data && data.data.length > 0) {
    return data.data[0].picture_medium;
  }
  return null;
}

async function getTrackAlbumCover(trackTitle, artistName) {
  if (!trackTitle || !artistName) return null;
  const url = `https://api.deezer.com/search?q=track:"${encodeURIComponent(trackTitle)}" artist:"${encodeURIComponent(artistName)}"`;
  const data = await fetchFromProxy(url);
  if (data.data && data.data.length > 0) {
    return data.data[0].album.cover_medium;
  }
  return null;
}

document.getElementById("fetchArtist").addEventListener("click", async () => {
  const name = document.getElementById("artistName").value.trim();
  const resultDiv = document.getElementById("artistResult");
  resultDiv.textContent = "Loading...";
  try {
    const imgUrl = await getArtistImage(name);
    if (imgUrl) {
      resultDiv.innerHTML = `<img src="${imgUrl}" alt="${name}">`;
    } else {
      resultDiv.textContent = "No image found for that artist.";
    }
  } catch (e) {
    resultDiv.textContent = `Error: ${e.message}`;
  }
});

document.getElementById("fetchTrack").addEventListener("click", async () => {
  const title = document.getElementById("trackTitle").value.trim();
  const artist = document.getElementById("trackArtist").value.trim();
  const resultDiv = document.getElementById("trackResult");
  resultDiv.textContent = "Loading...";
  try {
    const imgUrl = await getTrackAlbumCover(title, artist);
    if (imgUrl) {
      resultDiv.innerHTML = `<img src="${imgUrl}" alt="Album cover for ${title} by ${artist}">`;
    } else {
      resultDiv.textContent = "No album cover found for that track.";
    }
  } catch (e) {
    resultDiv.textContent = `Error: ${e.message}`;
  }
});

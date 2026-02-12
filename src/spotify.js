const CLIENT_ID = "770e8efa8e724b6686d065fb5f40d0fe";
const CLIENT_SECRET = "f198b209e028420080cff7912b9a6131";

export const getSpotifyToken = async () => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = encodeURIComponent(
    "https://accounts.spotify.com/api/token"
  );

  try {
    const response = await fetch(`${proxyUrl}${targetUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);
    return data.access_token;
  } catch (e) {
    console.error("Token error:", e);
    throw e;
  }
};

export const searchSpotify = async (query, token) => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = encodeURIComponent(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=15`
  );

  try {
    const response = await fetch(`${proxyUrl}${targetUrl}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);

    if (!data.tracks) return [];
    return data.tracks.items.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      cover: track.album.images[0]?.url || "",
    }));
  } catch (e) {
    console.error("Search error:", e);
    throw e;
  }
};

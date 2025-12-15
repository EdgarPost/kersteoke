export type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  artists: { id: string; name: string }[];
};

type SearchTracksResponse = {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
};

export async function searchTracks(
  token: string,
  query: string,
  limit = 10
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data: SearchTracksResponse = await response.json();
  return data.tracks.items;
}

export async function startPlayback(
  token: string,
  deviceId: string,
  trackUri: string
): Promise<void> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [trackUri],
        position_ms: 0,
      }),
    }
  );

  if (!response.ok && response.status !== 204 && response.status !== 202) {
    throw new Error(`Playback failed: ${response.status}`);
  }
}

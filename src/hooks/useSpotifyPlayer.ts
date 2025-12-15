import { useState, useEffect } from "react";

type UseSpotifyPlayerParams = {
  token?: string;
};

type Player = {
  seek: (position: number) => Promise<void>;
  resume: () => Promise<void>;
  pause: () => Promise<void>;
  _options: { name: string };
};

type CurrentTrack = {
  uri: string;
  id: string;
  type: string;
  media_type: string;
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: {
      url: string;
    }[];
  };
  artists: {
    uri: string;
    name: string;
  }[];
};

type UseSpotifyPlayerResult = {
  player: Player | null;
  deviceId: string | null;
  currentTrack: CurrentTrack | null;
  isReady: boolean;
};

export const useSpotifyPlayer = ({ token }: UseSpotifyPlayerParams): UseSpotifyPlayerResult => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Offerfeest 2025",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 1,
      });

      setPlayer(player);

      console.log(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          setCurrentTrack(null);
          return;
        }

        setCurrentTrack(state.track_window.current_track);
      });

      player.connect();
    };
  }, [token]);

  useEffect(() => {
    if (currentTrack?.id) {
      player.seek(0);
      player.pause();
    }
  }, [currentTrack?.id]);

  return { player, deviceId, currentTrack, isReady };
};

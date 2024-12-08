import { useState, useEffect } from "react";

type UseSpotifyPlayerParams = {
  token?: string;
}

type Player = {
  seek: (position: number) => Promise<void>
  resume: () => Promise<void>
}

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
}

type UseSpotifyPlayerResult = {
  player: Player;
  currentTrack: CurrentTrack;
}

export const useSpotifyPlayer = ({ token }: UseSpotifyPlayerParams) => {
  const [player, setPlayer] = useState();
  const [currentTrack, setCurrentTrack] = useState(null);

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
        name: 'Kersteoke',
        getOAuthToken: cb => { cb(token); },
        volume: 1
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state => {
        if (!state) {
          setCurrentTrack(null);
          return;
        }

        setCurrentTrack(state.track_window.current_track);
      }));

      player.connect();
    };
  }, [token]);

  useEffect(() => {
    if (currentTrack?.id) {
      player.seek(0);
      player.pause();
    }
  }, [currentTrack?.id]);

  return { player, currentTrack };
}

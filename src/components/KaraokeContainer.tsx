import LyricUploader from "./LyricUploader.tsx";
import { useEffect, useState } from "react";
import type { Lyric } from "../utils/karaoke.ts";
import { Karaoke } from "./Karaoke.tsx";
import { useAuthToken } from "../hooks/useAuthToken.ts";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.ts";

type State = 'idle' | 'playing'

export const KaraokeContainer = () => {
  const [lyric, setLyric] = useState<Lyric | null>(null);
  const [state, setState] = useState<State>('idle');
  const token = useAuthToken();
  const { player, currentTrack } = useSpotifyPlayer({ token });

  const hasLyric = lyric !== null;
  const isConnected = player !== null;
  const hasTrack = currentTrack !== null;
  const isReady = hasLyric && isConnected && hasTrack;

  const start = async () => {
    setState('playing');
  }

  const stop = async () => {
    setState('idle');
  }

  useEffect(() => {
    const updateState = async () => {
      if (state === 'playing') {
        await player?.seek(0);
        await player?.resume();
      }

      if (state === 'idle') {
        await player?.pause();
      }
    }

    void updateState();
  }, [state]);

  return (
    <div>
      <h1>Kersteoke</h1>
      {state === 'idle' && <>
        <div>
          LRC: {hasLyric ? `${lyric?.title} by ${lyric?.artist}` : "None"}
        </div>
        <div>
          Spotify: {hasTrack ? `${currentTrack?.name} by ${currentTrack?.artists[0].name}` : "None"}
        </div>

        {isReady && <div>
          <button onClick={start}>Play</button>
        </div>}

        <div className="absolute bottom-10">
          <LyricUploader onSuccess={setLyric} onError={console.log} />
          <br />
          Spotify Connect: {isConnected ? <>Available in Spotify as {player?._options.name}</> : <>Waiting for
            Spotify connection...</>}
          <br />
          <a href='/auth/logout'>Logout</a>
        </div>
      </>}

      {state === 'playing' && <>
        <Karaoke lyric={lyric!} track={currentTrack!} />

        <div className="absolute bottom-10">
          <button onClick={stop}>Stop</button>
        </div>
      </>}
    </div>
  )
}

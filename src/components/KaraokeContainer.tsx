import LyricUploader from "./LyricUploader.tsx";
import { useEffect, useState } from "react";
import type { Lyric } from "../utils/karaoke.ts";
import { Karaoke } from "./Karaoke.tsx";
import { useAuthToken } from "../hooks/useAuthToken.ts";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.ts";

type State = "idle" | "playing";

export const KaraokeContainer = () => {
  const [lyric, setLyric] = useState<Lyric | null>(null);
  const [state, setState] = useState<State>("idle");
  const token = useAuthToken();
  const { player, currentTrack } = useSpotifyPlayer({ token });

  const hasLyric = lyric !== null;
  const isConnected = player !== null;
  const hasTrack = currentTrack !== null;
  const isReady = isConnected && hasTrack;

  const start = async () => {
    setState("playing");
  };

  const stop = async () => {
    setState("idle");
  };

  useEffect(() => {
    const updateState = async () => {
      if (state === "playing") {
        await player?.seek(0);
        await player?.resume();
      }

      if (state === "idle") {
        await player?.pause();
      }
    };

    void updateState();
  }, [state]);

  return (
    <div>
      {state === "idle" && (
        <>
          <p className="mb-5 text-center">
            Hier kun je wat dingetjes testen. Je moet af en toe een beetje op
            Play drukken hier en in de Spotify app. Je komt er wel uit. Soms
            doet ie een beetje gek.
          </p>
          <p className="mb-5 text-center">
            Er wordt niets opgeslagen op de server, dus ik kan niet per ongeluk
            zien welk liedje je hebt uitgekozen.
          </p>
          <p className="mb-5 text-center">
            {isConnected ? (
              <>
                Je kunt nu de speaker "{player?._options.name}" selecteren in
                Spotify, en een liedje afspelen.
              </>
            ) : (
              <>Nog geen connectie met Spotify..</>
            )}
          </p>
          <p>
            Lyric (LRC):{" "}
            {hasLyric ? `${lyric?.title} by ${lyric?.artist}` : "Geen"}
          </p>
          <p>
            Huidige track:{" "}
            {hasTrack
              ? `${currentTrack?.name} by ${currentTrack?.artists[0].name}`
              : "Geen"}
          </p>

          <div>
            {hasTrack && (
              <button
                className="border-2 border-solid px-3 border-white"
                onClick={start}
              >
                SPEEL LIEDJE AF
              </button>
            )}
          </div>

          <br />
          <hr />
          <br />

          <p className="mb-5 text-center">
            Hier kun je een lyric (*.lrc) bestand selecteren:
          </p>

          <LyricUploader onSuccess={setLyric} onError={console.log} />
          <br />
          <br />
          <a
            className="border-2 border-solid px-3 border-white"
            href="/auth/logout"
          >
            UITLOGGEN
          </a>
        </>
      )}

      {state === "playing" && (
        <>
          {hasLyric && <Karaoke lyric={lyric!} track={currentTrack!} />}

          <div className="fixed left-5 top-5">
            <button
              className="border-2 border-solid px-3 border-white"
              onClick={stop}
            >
              STOP HET LIEDJE!!1
            </button>
          </div>
        </>
      )}
    </div>
  );
};

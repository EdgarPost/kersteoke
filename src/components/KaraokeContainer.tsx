import LyricUploader from "./LyricUploader.tsx";
import { useEffect, useState } from "react";
import type { Lyric } from "../utils/karaoke.ts";
import { Karaoke } from "./Karaoke.tsx";
import { useAuthToken } from "../hooks/useAuthToken.ts";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.ts";
import { useTrackSearch } from "../hooks/useTrackSearch.ts";
import { SearchInput } from "./SearchInput.tsx";
import { SearchResults } from "./SearchResults.tsx";
import { startPlayback, type SpotifyTrack } from "../services/spotifyApi.ts";

type State = "searching" | "trackSelected" | "playing";

export const KaraokeContainer = () => {
  const [lyric, setLyric] = useState<Lyric | null>(null);
  const [state, setState] = useState<State>("searching");
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const token = useAuthToken();
  const { player, deviceId, currentTrack, isReady } = useSpotifyPlayer({
    token,
  });
  const {
    query,
    setQuery,
    results,
    isLoading,
    error: searchError,
    search,
    clearResults,
  } = useTrackSearch(token);

  const hasLyric = lyric !== null;

  const handleTrackSelect = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    setState("trackSelected");
    setPlaybackError(null);
  };

  const handlePlay = async () => {
    if (!token || !deviceId || !selectedTrack) return;

    try {
      setPlaybackError(null);
      await startPlayback(token, deviceId, selectedTrack.uri);
      setState("playing");
    } catch (err) {
      console.error("Failed to start playback:", err);
      setPlaybackError(
        "Kon het liedje niet afspelen. Probeer het opnieuw of kies een ander liedje."
      );
    }
  };

  const handleStop = async () => {
    await player?.pause();
    setState("searching");
    setSelectedTrack(null);
    setLyric(null);
    clearResults();
  };

  const handleBackToSearch = () => {
    setState("searching");
    setSelectedTrack(null);
    setPlaybackError(null);
  };

  useEffect(() => {
    const updatePlayback = async () => {
      if (state === "playing" && player) {
        await player.seek(0);
        await player.resume();
      }
    };
    void updatePlayback();
  }, [state, player]);

  return (
    <div className="min-h-[60vh]">
      {state === "searching" && (
        <div className="space-y-6">
          {!isReady ? (
            <div className="text-center py-8">
              <div className="inline-block animate-pulse">
                <div className="w-8 h-8 border-4 border-christmas-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              </div>
              <p className="text-christmas-gold text-lg">
                Verbinden met Spotify...
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-white/80 mb-2">
                Zoek hieronder naar een liedje om af te spelen
              </p>

              <SearchInput
                value={query}
                onChange={setQuery}
                onSearch={search}
                isLoading={isLoading}
                placeholder="Zoek op titel of artiest..."
              />

              {searchError && (
                <p className="text-christmas-red-light text-center bg-black/50 p-3 rounded-lg">
                  {searchError}
                </p>
              )}

              <SearchResults
                tracks={results}
                onSelect={handleTrackSelect}
                selectedTrackId={selectedTrack?.id}
              />

              {results.length === 0 && query && !isLoading && (
                <p className="text-center text-white/60 py-8">
                  Geen resultaten gevonden. Probeer een andere zoekopdracht.
                </p>
              )}
            </>
          )}

          <div className="text-center pt-4 border-t border-white/20">
            <a
              className="text-white/60 hover:text-white transition-colors text-sm"
              href="/auth/logout"
            >
              Uitloggen
            </a>
          </div>
        </div>
      )}

      {state === "trackSelected" && selectedTrack && (
        <div className="space-y-6">
          <button
            onClick={handleBackToSearch}
            className="text-christmas-gold hover:text-christmas-gold-light transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Terug naar zoeken
          </button>

          <div className="bg-black/40 rounded-xl p-6 border-2 border-christmas-gold/30">
            <div className="flex items-center gap-6">
              <img
                src={
                  selectedTrack.album.images[1]?.url ||
                  selectedTrack.album.images[0]?.url
                }
                alt={selectedTrack.album.name}
                className="w-32 h-32 rounded-lg shadow-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedTrack.name}
                </h2>
                <p className="text-white/70 text-lg">
                  {selectedTrack.artists.map((a) => a.name).join(", ")}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {selectedTrack.album.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border-2 border-christmas-green/30">
            <h3 className="text-lg font-semibold text-white mb-3">
              Songtekst (optioneel)
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Upload een .lrc bestand voor karaoke met gesynchroniseerde tekst
            </p>
            <LyricUploader onSuccess={setLyric} onError={console.log} />
            {hasLyric && (
              <p className="text-christmas-green-light mt-3">
                Geladen: {lyric?.title} - {lyric?.artist}
              </p>
            )}
          </div>

          {playbackError && (
            <p className="text-christmas-red-light text-center bg-black/50 p-3 rounded-lg">
              {playbackError}
            </p>
          )}

          <button
            onClick={handlePlay}
            disabled={!isReady}
            className="w-full py-4 bg-christmas-red hover:bg-christmas-red-dark
                       text-white text-xl font-bold rounded-xl disabled:opacity-50
                       transition-all border-2 border-christmas-gold
                       hover:scale-[1.02] active:scale-[0.98]"
          >
            SPEEL AF
          </button>
        </div>
      )}

      {state === "playing" && (
        <>
          {hasLyric && currentTrack && (
            <Karaoke lyric={lyric!} track={currentTrack} />
          )}

          {!hasLyric && selectedTrack && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <img
                src={
                  selectedTrack.album.images[0]?.url ||
                  selectedTrack.album.images[1]?.url
                }
                alt={selectedTrack.album.name}
                className="w-64 h-64 rounded-xl shadow-2xl mb-8"
              />
              <h2 className="text-4xl font-bold text-white mb-2">
                {selectedTrack.name}
              </h2>
              <p className="text-white/70 text-xl">
                {selectedTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          )}

          <div className="fixed left-5 top-5 z-50">
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-christmas-red hover:bg-christmas-red-dark
                         text-white font-bold rounded-lg transition-colors
                         border-2 border-christmas-gold shadow-lg"
            >
              STOP
            </button>
          </div>
        </>
      )}
    </div>
  );
};

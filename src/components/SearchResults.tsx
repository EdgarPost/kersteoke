import type { SpotifyTrack } from "../services/spotifyApi";

type SearchResultsProps = {
  tracks: SpotifyTrack[];
  onSelect: (track: SpotifyTrack) => void;
  selectedTrackId?: string;
};

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const SearchResults = ({
  tracks,
  onSelect,
  selectedTrackId,
}: SearchResultsProps) => {
  if (tracks.length === 0) return null;

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto rounded-lg">
      {tracks.map((track) => (
        <button
          key={track.id}
          onClick={() => onSelect(track)}
          className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-left
            ${
              selectedTrackId === track.id
                ? "bg-christmas-green border-2 border-christmas-gold scale-[1.02]"
                : "bg-black/40 hover:bg-christmas-green/50 border-2 border-transparent hover:border-christmas-gold/50"
            }`}
        >
          <img
            src={track.album.images[2]?.url || track.album.images[0]?.url}
            alt={track.album.name}
            className="w-14 h-14 rounded shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate text-lg">
              {track.name}
            </p>
            <p className="text-white/70 text-sm truncate">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
          <div className="text-white/50 text-sm font-mono">
            {formatDuration(track.duration_ms)}
          </div>
        </button>
      ))}
    </div>
  );
};

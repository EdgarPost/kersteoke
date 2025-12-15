import { useState, useCallback } from "react";
import { searchTracks, type SpotifyTrack } from "../services/spotifyApi";

type UseTrackSearchResult = {
  query: string;
  setQuery: (query: string) => void;
  results: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
  search: () => Promise<void>;
  clearResults: () => void;
};

export const useTrackSearch = (token: string | undefined): UseTrackSearchResult => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!token || !query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(token, query);
      setResults(tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Zoeken mislukt");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, query]);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery("");
  }, []);

  return { query, setQuery, results, isLoading, error, search, clearResults };
};

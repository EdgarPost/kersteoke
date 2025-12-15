import { useState, useCallback, useEffect, useRef } from "react";
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

const DEBOUNCE_MS = 400;

export const useTrackSearch = (token: string | undefined): UseTrackSearchResult => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (searchQuery?: string) => {
    const q = searchQuery ?? query;
    if (!token || !q.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(token, q);
      setResults(tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Zoeken mislukt");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, query]);

  // Debounced auto-search when query changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      search(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, token]);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery("");
  }, []);

  return { query, setQuery, results, isLoading, error, search, clearResults };
};

import { useEffect, useState } from "react";
import type { Lyric, LyricLine, SongInfo } from "../utils/karaoke.ts";

type UseKaraokeResult = {
  play: () => void;
  stop: () => void;
  state: State;
  songInfo: SongInfo;
  previousLines: LyricLine[];
  currentLine: LyricLine;
  elapsedTime: number;
};

type State = "stopped" | "playing";
const speed = 1;

export const useKaraoke = (lyric: Lyric): UseKaraokeResult => {
  const [state, setState] = useState<State>("stopped");
  const [previousLines, setPreviousLines] = useState<LyricLine[]>([]);
  const [currentLine, setCurrentLine] = useState<LyricLine>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const play = () => {
    setState("playing");
  };

  const stop = () => {
    setState("stopped");
  };

  useEffect(() => {
    let interval;

    if (state === "playing") {
      const startTime = Date.now();
      interval = setInterval(() => {
        setElapsedTime(speed * (Date.now() - startTime));
      }, 200);

      return () => {
        clearInterval(interval);
      };
    }

    if (state === "stopped") {
      interval && clearInterval(interval);
      setElapsedTime(0);
      setCurrentLine(null);

      return () => {};
    }
  }, [state]);

  useEffect(() => {
    if (state === "playing") {
      const nextLine = lyric.lines.findLast((line) => elapsedTime >= line.time);

      if (nextLine !== currentLine) {
        setPreviousLines((lines) => {
          if (currentLine) {
            return [...lines, currentLine];
          }

          return lines;
        });

        setCurrentLine(nextLine);
      }
    }
  }, [state, elapsedTime, lyric.lines]);

  return {
    play,
    stop,
    state,
    songInfo: {
      id: lyric.id,
      artist: lyric.artist,
      title: lyric.title,
      album: lyric.album,
    },
    previousLines,
    currentLine,
    elapsedTime,
  };
};

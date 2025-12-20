import type { Lyric, LyricLine } from "../utils/karaoke.ts";
import { useEffect } from "react";
import { useKaraoke } from "../hooks/useKaraoke.ts";

type KaraokeProps = {
  lyric: Lyric;
  track: {
    duration_ms: number;
  };
};

type KaraokeLinesProps = {
  lines: LyricLine[];
  currentIndex: number;
  elapsedTime: number;
  fadeOutProgress: number; // 0 = no fade, 1 = fully faded
};

type Position = "previous" | "current" | "next" | "hidden";

const LOOKAHEAD_MS = 2000; // Show next line 2 seconds before it's sung

const getLineStyles = (position: Position) => {
  switch (position) {
    case "previous":
      return {
        opacity: 0.35,
        transform: "translateY(-80px) scale(0.75)",
        color: "rgba(255,255,255,0.8)",
        fontSize: "clamp(1.2rem, 4vw, 2rem)",
      };
    case "current":
      return {
        opacity: 1,
        transform: "translateY(0) scale(1)",
        color: "#FFD700",
        fontSize: "clamp(1.5rem, 5vw, 3rem)",
      };
    case "next":
      return {
        opacity: 0.5,
        transform: "translateY(80px) scale(0.85)",
        color: "rgba(255,255,255,0.8)",
        fontSize: "clamp(1.2rem, 4vw, 2rem)",
      };
    case "hidden":
      return {
        opacity: 0,
        transform: "translateY(160px) scale(0.7)",
        color: "rgba(255,255,255,0.8)",
        fontSize: "clamp(1.2rem, 4vw, 2rem)",
      };
  }
};

export const KaraokeLines = ({
  lines,
  currentIndex,
  elapsedTime,
  fadeOutProgress,
}: KaraokeLinesProps) => {
  const containerOpacity = 1 - fadeOutProgress;

  // Before first line: show first line as "next" when within lookahead
  if (currentIndex === -1) {
    const firstLine = lines[0];
    if (!firstLine) return null;

    const timeUntilFirst = firstLine.time - elapsedTime;
    const showFirst = timeUntilFirst <= LOOKAHEAD_MS;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center pb-24 overflow-hidden transition-opacity duration-1000"
        style={{ opacity: containerOpacity }}
      >
        <div
          className="absolute inset-x-0 bg-black/50 backdrop-blur-sm"
          style={{
            top: "50%",
            transform: "translateY(calc(-50% - 3rem))",
            height: "280px",
          }}
        />
        <div
          key={firstLine.time}
          className="absolute px-4 py-3 text-center transition-all duration-500 ease-out"
          style={{
            ...getLineStyles(showFirst ? "next" : "hidden"),
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
            fontWeight: "normal",
          }}
        >
          {firstLine.text}
        </div>
      </div>
    );
  }

  // Only render lines within a range of current
  const visibleRange = 2;
  const visibleLines = lines
    .map((line, index) => ({ line, index }))
    .filter(
      ({ index }) =>
        index >= currentIndex - visibleRange &&
        index <= currentIndex + visibleRange
    );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pb-24 overflow-hidden"
      style={{ opacity: containerOpacity }}
    >
      <div
          className="absolute inset-x-0 bg-black/50 backdrop-blur-sm"
          style={{
            top: "50%",
            transform: "translateY(calc(-50% - 3rem))",
            height: "280px",
          }}
        />
      {visibleLines.map(({ line, index }) => {
        let position: Position;
        if (index === currentIndex - 1) position = "previous";
        else if (index === currentIndex) position = "current";
        else if (index === currentIndex + 1) position = "next";
        else position = "hidden";

        const styles = getLineStyles(position);

        return (
          <div
            key={line.time}
            className="absolute px-4 py-3 text-center transition-all duration-500 ease-out"
            style={{
              ...styles,
              textShadow:
                position === "current"
                  ? "2px 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.3)"
                  : "1px 1px 4px rgba(0,0,0,0.6)",
              fontWeight: position === "current" ? "bold" : "normal",
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};

export const Karaoke = ({ lyric, track }: KaraokeProps) => {
  const {
    play,
    state,
    currentLine,
    elapsedTime,
  } = useKaraoke(lyric);

  useEffect(() => {
    play();
  }, [lyric]);

  const percentage = (100 / track.duration_ms) * elapsedTime;

  // Find the current line index (-1 if no line has started yet)
  const currentIndex = currentLine
    ? lyric.lines.findIndex((line) => line.time === currentLine.time)
    : -1;

  // Calculate fade-out progress when on the last line
  const FADE_OUT_DURATION_MS = 5000;
  const isLastLine = currentIndex === lyric.lines.length - 1;
  const lastLineTime = lyric.lines[lyric.lines.length - 1]?.time ?? 0;
  const timeSinceLastLine = elapsedTime - lastLineTime;
  const fadeOutProgress = isLastLine
    ? Math.min(1, Math.max(0, timeSinceLastLine / FADE_OUT_DURATION_MS))
    : 0;

  return (
    <div>
      {state === "playing" && (
        <KaraokeLines
          lines={lyric.lines}
          currentIndex={currentIndex}
          elapsedTime={elapsedTime}
          fadeOutProgress={fadeOutProgress}
        />
      )}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-black/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-christmas-gold to-christmas-gold-light transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

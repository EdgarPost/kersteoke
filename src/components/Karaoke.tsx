import type { Lyric, LyricLine } from "../utils/karaoke.ts";
import { KaraokeLine } from "./KaraokeLine.tsx";
import { useEffect } from "react";
import { useKaraoke } from "../hooks/useKaraoke.ts";

type KaraokeProps = {
  lyric: Lyric;
  track: {
    duration_ms: number;
  };
};

type KaraokeLinesProps = {
  currentLine: LyricLine;
  previousLines: LyricLine[];
};

const MAX_VISIBLE_LINES = 5;

export const KaraokeLines = ({
  currentLine,
  previousLines,
}: KaraokeLinesProps) => {
  const visiblePreviousLines = previousLines.slice(-MAX_VISIBLE_LINES);

  return (
    <div className="fixed inset-0 flex flex-col justify-end pb-24 overflow-hidden">
      {/* Star Wars perspective container for previous lines */}
      <div
        className="flex-1 flex flex-col justify-end items-center"
        style={{
          perspective: "400px",
          perspectiveOrigin: "center bottom",
        }}
      >
        <div
          className="w-full text-center"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {visiblePreviousLines.map((line, index) => {
            const reverseIndex = visiblePreviousLines.length - index;
            const opacity = Math.max(0, 1 - reverseIndex * 0.25);
            const translateZ = -reverseIndex * 80;
            const translateY = -reverseIndex * 40;
            const scale = Math.max(0.4, 1 - reverseIndex * 0.12);

            return (
              <div
                key={`${line.text}-${index}`}
                className="transition-all duration-500 ease-out py-2"
                style={{
                  transform: `translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "clamp(1.2rem, 4vw, 2rem)",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                  lineHeight: 1.4,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current line - fixed at bottom, prominent */}
      <div className="px-4 py-6 bg-gradient-to-t from-black/80 to-transparent">
        <KaraokeLine>{currentLine.text}</KaraokeLine>
      </div>
    </div>
  );
};

export const Karaoke = ({ lyric, track }: KaraokeProps) => {
  const {
    play,
    state,
    previousLines,
    currentLine,
    elapsedTime,
  } = useKaraoke(lyric);

  useEffect(() => {
    play();
  }, [lyric]);

  const percentage = (100 / track.duration_ms) * elapsedTime;

  return (
    <div>
      {state === "playing" && currentLine && (
        <KaraokeLines
          currentLine={currentLine}
          previousLines={previousLines}
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

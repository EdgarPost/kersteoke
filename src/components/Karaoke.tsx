import type { Lyric, LyricLine } from "../utils/karaoke.ts";
import { KaraokeLine } from "./KaraokeLine.tsx";
import { useEffect } from "react";
import { useKaraoke } from "../hooks/useKaraoke.ts";

type KaraokeProps = {
  lyric: Lyric;
};

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}

type KaraokeLinesProps = {
  currentLine: LyricLine;
  previousLines: LyricLine[];
};
const maxOpacityLines = 3; // Number of lines with maximum opacity

export const KaraokeLines = ({
  currentLine,
  previousLines,
}: KaraokeLinesProps) => {
  const linesToFade = Math.min(previousLines.length, maxOpacityLines) + 1;

  console.log(linesToFade);

  return (
    <div className="absolute left-0 right-0 bottom-48 text-center w-full">
      <ol className="mb-4">
        {previousLines.map((line, index) => {
          const opacity =
            index >= previousLines.length - linesToFade
              ? (linesToFade - (index - (previousLines.length - linesToFade))) /
                linesToFade
              : 0;

          const flippedOpacity = opacity === 0 ? 0 : 1 - opacity;
          const fontSize = 60 * opacity;
          const flippedFontSize = fontSize === 0 ? 0 : 60 - fontSize;

          return (
            <li
              key={index}
              style={{
                fontSize: flippedFontSize,
                lineHeight: `${flippedFontSize}px`,
                background: `rgba(0,0,0,0.5)`,
                opacity: flippedOpacity,
              }}
            >
              {line.text}
            </li>
          );
        })}
      </ol>
      <KaraokeLine>{currentLine.text}</KaraokeLine>
    </div>
  );
};

export const Karaoke = ({ lyric, track }: KaraokeProps) => {
  const {
    play,
    stop,
    state,
    songInfo,
    previousLines,
    currentLine,
    elapsedTime,
  } = useKaraoke(lyric);

  useEffect(() => {
    console.log("Lyric", lyric);
    play();
  }, [lyric]);

  const percentage = (100 / track.duration_ms) * elapsedTime;
  console.log({ percentage });

  return (
    <div>
      {state === "playing" && currentLine && (
        <KaraokeLines currentLine={currentLine} previousLines={previousLines} />
      )}
      <div className="fixed bottom-0 left-0 right-0 h-3 blur-sm">
        <div
          className="h-full bg-white w-96"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

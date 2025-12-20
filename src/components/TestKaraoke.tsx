import type { Lyric } from "../utils/karaoke.ts";
import { Karaoke } from "./Karaoke.tsx";

const FAKE_LYRIC: Lyric = {
  id: "test-song",
  artist: "Test Artist",
  title: "Test Song",
  album: "Test Album",
  lines: [
    { time: 5000, text: "Welcome to the karaoke test!" },
    { time: 8000, text: "This is line number two" },
    { time: 11000, text: "And here comes the third line" },
    { time: 14000, text: "The lyrics keep on flowing" },
    { time: 17000, text: "Like a river to the sea" },
    { time: 20000, text: "Testing one two three" },
    { time: 23000, text: "Can you sing along with me?" },
    { time: 26000, text: "The music fills the air" },
    { time: 29000, text: "With melodies so fair" },
    { time: 32000, text: "This is the final line!" },
    { time: 35000, text: "..." },
  ],
};

const FAKE_TRACK = {
  duration_ms: 38000,
};

export const TestKaraoke = () => {
  return (
    <div>
      <Karaoke lyric={FAKE_LYRIC} track={FAKE_TRACK} />
      <div className="fixed left-5 top-5 z-50">
        <a
          href="/"
          className="px-6 py-3 bg-christmas-red hover:bg-christmas-red-dark
                     text-white font-bold rounded-lg transition-colors
                     border-2 border-christmas-gold shadow-lg inline-block"
        >
          BACK
        </a>
      </div>
    </div>
  );
};

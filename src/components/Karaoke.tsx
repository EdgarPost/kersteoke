import type {Lyric} from "../utils/karaoke.ts";
import {KaraokeLine} from "./KaraokeLine.tsx";
import {useEffect, useState} from "react";
import {useKaraoke} from "../hooks/useKaraoke.ts";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;

type KaraokeProps = {
    lyric: Lyric;
}

function formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}

export const Karaoke = ({ lyric }: KaraokeProps) => {
    const {
        play,
        stop,
        state,
        songInfo,
        previousLines,
        currentLine,
        elapsedTime
    } = useKaraoke(lyric);

    useEffect(() => {
        console.log('Lyric', lyric);
        play();
    }, [lyric.id]);

    return (
        <div>
            <h2>{songInfo.title}</h2>
            <p>{songInfo.artist}</p>
            <p>{songInfo.album}</p>
            <button onClick={play}>Play</button>
            <button onClick={stop}>Stop</button>
            {state === 'playing' &&  currentLine && (
                <div className="absolute left-0 right-0 bottom-10 text-center w-full">
                    <ol>
                        {previousLines.map((line, index) => (
                            <li key={index} style={{opacity: .5}}>{line.text}</li>
                        ))}
                    </ol>
                    <KaraokeLine>
                        {currentLine.text}
                    </KaraokeLine>
                </div>
            )}
            <p>Progress: {formatTime(elapsedTime)} ({elapsedTime})</p>
        </div>
    );
}
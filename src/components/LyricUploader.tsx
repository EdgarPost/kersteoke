import React, { useState } from 'react';
import { parseLyric} from "../utils/karaoke.ts";
import type {Lyric} from "../utils/karaoke.ts";

type LyricUploaderProps = {
    onSuccess: (lyric: Lyric) => void;
    onError: (error: Error) => void;
};

export const LyricUploader = ({onSuccess, onError}) => {

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        const file = event.target.files?.[0];

        console.log(file);
        if (file) {
            try {
                const fileContents = await readFileAsync(file);
                console.log(fileContents);
                const lyric = parseLyric(fileContents);

                onSuccess(lyric);
            } catch (error) {
                console.log(error);
                onError(error);
            }
        }
    };

    const readFileAsync = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target) {
                    resolve(event.target.result as string);
                } else {
                    reject(new Error('Failed to read file.'));
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsText(file);
        });
    };

    return (
        <div>
            <input type="file" onInput={handleFileUpload} accept=".lrc" />
        </div>
    );
};

export default LyricUploader;

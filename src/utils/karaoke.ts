export type LyricLine = {
    time: number;
    timestamp?: string;
    text: string;
};

export type SongInfo = {
    id: string;
    artist: string;
    title: string;
    album: string;
}

export type Lyric = {
    lines: LyricLine[];
} & SongInfo

export function parseLyric(lrcContent: string): Lyric {
    const lines = lrcContent.split('\n');
    let id = '';
    let artist = '';
    let title = '';
    let album = '';
    const lyricLines: LyricLine[] = [];

    for (const line of lines) {
        const matchId = line.match(/^\[id:(.*?)\]/);
        const matchArtist = line.match(/^\[ar:(.*?)\]/);
        const matchTitle = line.match(/^\[ti:(.*?)\]/);
        const matchAlbum = line.match(/^\[al:(.*?)\]/);
        const matchTimestamps = line.match(/\[(\d+:\d+\.\d+)\]/g);

        if (matchId) {
            id = matchId[1].trim();
        } else if (matchArtist) {
            artist = matchArtist[1].trim();
        } else if (matchTitle) {
            title = matchTitle[1].trim();
        } else if (matchAlbum) {
            album = matchAlbum[1].trim();
        } else if (matchTimestamps) {
            const text = line.replace(/\[\d+:\d+\.\d+\]/g, '').trim();
            for (const timestamp of matchTimestamps) {
                const [minutes, seconds] = timestamp
                    .replace('[', '')
                    .replace(']', '')
                    .split(':')
                    .map(Number);

                const time = minutes * 60 * 1000 + seconds * 1000;
                lyricLines.push({ time, timestamp, text });
            }
        }
    }

    lyricLines.sort((a, b) => a.time - b.time);

    lyricLines.push({
        time: lyricLines[lyricLines.length - 1].time + 6000,
        text: '...',
    });

    return {
        id,
        artist,
        title,
        album,
        lines: lyricLines,
    };
}

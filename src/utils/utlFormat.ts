export function formatYoutubeLink(artist: string, song: string) {
    return `https://www.youtube.com/results?search_query=${encodeURI(artist)}+${encodeURI(song)}`;
}

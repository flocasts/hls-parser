import * as HLS from '../../src';
import { MasterPlaylist, MediaPlaylist } from '../../src/types';

HLS.setOptions({ strictMode: true });

export function parsePass(text: string): MediaPlaylist | MasterPlaylist {
    const obj: MediaPlaylist | MasterPlaylist = HLS.parse(text);
    expect(obj).toBeTruthy();
    return obj;
}

export function stringifyPass(obj: MediaPlaylist | MasterPlaylist): string {
    const text: string = HLS.stringify(obj);
    expect(text).toBeTruthy();
    return text;
}

export function bothPass(text: string): string {
    const obj: MediaPlaylist | MasterPlaylist = parsePass(text);
    return stringifyPass(obj);
}

export function parseFail(text: string): void {
    expect(() => HLS.parse(text)).toThrow();
}

export function stringifyFail(obj: MediaPlaylist | MasterPlaylist): void {
    expect(() => HLS.stringify(obj)).toThrow();
}

export function stripSpaces(text: string): string {
    const chars = [];
    let insideDoubleQuotes = false;
    for (const ch of text) {
        if (ch === '"') {
            insideDoubleQuotes = !insideDoubleQuotes;
        } else if (ch === ' ') {
            if (!insideDoubleQuotes) {
                continue;
            }
        }
        chars.push(ch);
    }
    return chars.join('');
}

export function stripCommentsAndEmptyLines(text: string): string {
    const lines = [];
    for (const l of text.split('\n')) {
        const line = l.trim();
        if (!line) {
            // empty line
            continue;
        }
        if (line.startsWith('#')) {
            if (line.startsWith('#EXT')) {
                // tag
                lines.push(stripSpaces(line));
            }
            // comment
            continue;
        }
        // uri
        lines.push(line);
    }
    return lines.join('\n');
}

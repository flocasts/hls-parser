import fixtures from '../../helpers/fixtures';
import { MasterPlaylist, MediaPlaylist } from '../../../src/types';
import { safeParseMaster, safeParseMedia } from '../../../src/parse';
import { setOptions } from '../../../src';

describe('safeParseMaster', () => {
    test('happy path', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.5-Master-Playlist-with-I-Frames');

        const masterPlaylist: MasterPlaylist = safeParseMaster(m3u8);
        expect(masterPlaylist.isMasterPlaylist).toBe(true);
    });

    test('Type mismatch error', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.1-Simple-Media-Playlist');
        setOptions({ strictMode: true });

        let error: Error | undefined;
        try {
            safeParseMaster(m3u8);
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Playlist is not a Master Playlist');
    });
});

describe('safeParseMedia', () => {
    test('happy path', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.1-Simple-Media-Playlist');

        const mediaPlaylist: MediaPlaylist = safeParseMedia(m3u8);
        expect(mediaPlaylist.isMasterPlaylist).toBe(false);
    });

    test('Type mismatch error', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.5-Master-Playlist-with-I-Frames');
        setOptions({ strictMode: true });

        let error: Error | undefined;
        try {
            safeParseMedia(m3u8);
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Playlist is not a Media Playlist');
    });
});

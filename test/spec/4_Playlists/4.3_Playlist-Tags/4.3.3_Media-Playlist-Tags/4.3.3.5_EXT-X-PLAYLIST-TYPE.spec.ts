import * as HLS from '../../../../../src';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.3_Media-Playlist-Tags', () => {
    // #EXT-X-PLAYLIST-TYPE:<EVENT|VOD>
    test('#EXT-X-PLAYLIST-TYPE_01', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-PLAYLIST-TYPE:EVENT
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.playlistType).toBe('EVENT');
    });

    // #EXT-X-PLAYLIST-TYPE:<EVENT|VOD>
    test('#EXT-X-PLAYLIST-TYPE_02', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-PLAYLIST-TYPE:VOD
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.playlistType).toBe('VOD');
    });

    // #EXT-X-PLAYLIST-TYPE:<EVENT|VOD>
    test('#EXT-X-PLAYLIST-TYPE_03', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.playlistType).toBeUndefined();
    });
});

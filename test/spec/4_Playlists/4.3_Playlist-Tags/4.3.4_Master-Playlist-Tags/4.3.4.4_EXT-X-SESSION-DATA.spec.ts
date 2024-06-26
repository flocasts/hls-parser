import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.4_Master-Playlist-Tags', () => {
    // DATA-ID attribute is REQUIRED.
    test('#EXT-X-SESSION-DATA_01', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-SESSION-DATA:LANGUAGE="en",VALUE="This is an example"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example"
        `);
    });

    // Each EXT-X-SESSION-DATA tag MUST contain either a VALUE or URI
    // attribute, but not both.
    test('#EXT-X-SESSION-DATA_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",URI="/data/title.json"
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example",URI="/data/title.json"
        `);
    });

    // A Playlist MUST NOT contain more than one EXT-X-SESSION-DATA tag
    // with the same DATA-ID attribute and the same LANGUAGE attribute.
    test('#EXT-X-SESSION-DATA_03', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example"
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="en",VALUE="This is an example"
          #EXT-X-SESSION-DATA:DATA-ID="com.example.title",LANGUAGE="ja",VALUE="This is an example"
        `);
    });
});

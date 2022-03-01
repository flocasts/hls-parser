import * as path from 'path';
import * as fs from 'fs';

const fixtures = [];
const baseDir = path.join(__dirname, '../fixtures/m3u8');
const filenames = fs.readdirSync(baseDir);

for (const filename of filenames) {
  if (filename.endsWith('.m3u8')) {
    const name = path.basename(filename, '.m3u8');
    const filepath = path.join(baseDir, filename);
    const m3u8 = fs.readFileSync(filepath, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const object = require(`../fixtures/objects/${name}.ts`).default;
    fixtures.push({name, m3u8, object});
  }
}

export default fixtures;

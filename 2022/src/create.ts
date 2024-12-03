import { cpSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

if (process.argv.length !== 3) throw 'usage: new [day_name]';

const day = process.argv[2];
const dir = join(__dirname, day);
const template = join(__dirname, 'template.ts');

if (!existsSync(dir)) mkdirSync(dir);

cpSync(template, join(dir, 'part1.ts'));
cpSync(template, join(dir, 'part2.ts'));

writeFileSync(join(dir, 'sample.txt'), '');
writeFileSync(join(dir, 'input.txt'), '');

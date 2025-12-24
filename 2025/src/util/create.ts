import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getData } from './data';

// Get current day in EST
const currentDay = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })).getDate();

const day = process.argv[2] || currentDay.toString();
const dir = join(__dirname, '../', day);
const templateFile = join(__dirname, 'template.ts');
const template = readFileSync(templateFile).toString();

if (!existsSync(dir)) {
  mkdirSync(dir);
  console.log(`Creating files for day ${day}`);
} else {
  console.log(`Updating files for day ${day}`);
}

const part1 = join(dir, 'part1.ts');
const part2 = join(dir, 'part2.ts');

if (!existsSync(part1)) writeFileSync(part1, template.replace('input.txt', 'sample1.txt'));
if (!existsSync(part2)) writeFileSync(part2, template.replace('input.txt', 'sample2.txt'));

getData(parseInt(day)).then((data) => {
  writeFileSync(join(dir, 'info.md'), data.info || '');

  if (data.examples[0]) writeFileSync(join(dir, 'sample1.txt'), data.examples[0]);
  if (data.examples[1]) writeFileSync(join(dir, 'sample2.txt'), data.examples[1]);

  if (data.input) writeFileSync(join(dir, 'input.txt'), data.input);
});

import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'sample2.txt')).toString();
const lines = data.trim().split('\n');

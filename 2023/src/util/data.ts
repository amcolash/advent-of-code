import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
import turndown from 'turndown';

dotenv.config();
const sessionCookie = process.env.SESSION;
const options = { headers: { Cookie: `session=${sessionCookie}` } };

const turndownService = new turndown({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

export const getData = async (day: number) => {
  const dayUrl = `https://adventofcode.com/2023/day/${day}`;
  const inputUrl = `https://adventofcode.com/2023/day/${day}/input`;

  const data = await (await fetch(dayUrl, options)).text();
  const dom = new JSDOM(data);
  const document = dom.window.document;

  const info = Array.from(document.querySelectorAll('article'))
    .map((e) => e.innerHTML)
    .join('\n');
  const examples = Array.from(document.querySelectorAll<HTMLElement>('pre code')).map((e) => e.textContent);

  const input = await (await fetch(inputUrl, options)).text();

  return {
    info: turndownService.turndown(info),
    examples,
    input,
  };
};

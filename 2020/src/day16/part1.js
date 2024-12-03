const fs = require('fs');
const { type } = require('os');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const rules = input
  .split('\n')
  .map((r) => {
    const match = r.match(/([\w ]+): ([\d\-]+) or ([\d\-]+)/);
    if (match) {
      return {
        name: match[1],
        range1: {
          start: Number.parseInt(match[2].split('-')[0]),
          end: Number.parseInt(match[2].split('-')[1]),
        },
        range2: {
          start: Number.parseInt(match[3].split('-')[0]),
          end: Number.parseInt(match[3].split('-')[1]),
        },
      };
    }
  })
  .filter((r) => r !== undefined);

const yourTicketMatch = input.match(/your ticket:\n([\d,]+)/);
const yourTicket = yourTicketMatch[1].split(',').map((n) => Number.parseInt(n));

const nearbyString = input.substring(input.indexOf('nearby tickets:') + 'nearby tickets:'.length, input.length).trim();
const otherTickets = nearbyString.split('\n').map((t) => t.split(',').map((n) => Number.parseInt(n)));

const ruleArray = new Array(1000).fill(false);
rules.forEach((r) => {
  for (let i = r.range1.start; i <= r.range1.end; i++) {
    ruleArray[i] = true;
  }

  for (let i = r.range2.start; i <= r.range2.end; i++) {
    ruleArray[i] = true;
  }
});

let errors = 0;
otherTickets.forEach((t) => {
  t.forEach((v) => {
    if (!ruleArray[v]) errors += v;
  });
});

console.log(errors);
